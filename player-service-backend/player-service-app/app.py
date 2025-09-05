from flask import Flask, request, jsonify
import pandas as pd
import sqlite3
from sqlalchemy import create_engine
from player_service import PlayerService
import ollama
from flask_cors import CORS
import asyncio
import websockets
import threading
import json

app = Flask(__name__)
CORS(app, resources={r"/v1/*": {"origins": "http://localhost:3000"}})

# Load CSV file in pandas dataframe and create SQLite database
df = pd.read_csv('Player.csv')
engine = create_engine('sqlite:///player.db', echo=True)
df.to_sql('players', con=engine, if_exists='replace', index=False)

# Get all players
@app.route('/v1/players', methods=['GET'])
def get_players():
    player_service = PlayerService()
    result = player_service.get_all_players()
    return {"players": result}

@app.route('/v1/players/<string:player_id>')
def query_player_id(player_id):
    player_service = PlayerService()
    result = player_service.search_by_player(player_id)

    if len(result) == 0:
        return {"error": "No record found with player_id={}".format(player_id)}
    else:
        return {"player": result}

@app.route('/v1/chat/list-models')
def list_models():
    return jsonify(ollama.list())

@app.route('/v1/chat', methods=['POST'])
def chat():
    # Process the data as needed
    response = ollama.chat(model='tinyllama', messages=[
        {
            'role': 'user',
            'content': 'Why is the sky blue?',
        },
    ])
    return jsonify(response), 200

# Create the websocket server
async def websocket_server():
    async with websockets.serve(websocket_handler, "localhost", 8765):
        await asyncio.Future()

# Handle incoming websocket messages
async def websocket_handler(websocket, path):
    async for message in websocket:
        print(message)
        response = ollama.chat(model='tinyllama', stream=True, messages=[
            {
                'role': 'user',
                'content': message,
            },
        ])
        for x in response:
            await websocket.send(json.dumps(x))


if __name__ == '__main__':
    # Start WebSocket server in a separate thread
    def start_websocket_server():
        asyncio.run(websocket_server())
    
    websocket_thread = threading.Thread(target=start_websocket_server, daemon=True)
    websocket_thread.start()
    
    # Run Flask app in the main thread (required for signals to work)
    app.run(host='0.0.0.0', port=8080, debug=True, use_reloader=False)
