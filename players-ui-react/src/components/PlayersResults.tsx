import React, { useEffect, useState } from 'react';

import { validateId, validateCountryCode } from '../utils/index';
import { useListPlayersQuery } from '../utils/api.js';
// import fetchData from '../utils/DataFetcher';

function PlayerResults() {

    const [players, setPlayers] = useState<any[]>([]);
    const { data: playersData, isLoading, isError } = useListPlayersQuery();

    const [chatMessage, setChatMessage] = useState<string>('');
    const [chatResponse, setChatResponse] = useState<string>('');
    const [chatLoading, setChatLoading] = useState<boolean>(false);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [buffer, setBuffer] = useState<string>('');

    const handleChat = () => {
        if (socket) {
            socket.send(chatMessage);
            setChatResponse('');
            setChatLoading(true);
        }
    };

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8765");
        socket.onopen = () => setSocket(socket);
      
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setChatLoading(false);
            if (!data.done) {
                setBuffer((prev) => prev + data.message.content); // 👈 type new chunk
            }
        };
      
        return () => socket.close();
    }, []);

    useEffect(() => {
        if (!buffer) return;

        const interval = setInterval(() => {
            setBuffer((prevBuffer) => {
                if (prevBuffer.length === 0) {
                    clearInterval(interval);
                    return prevBuffer;
                }
                const nextChar = prevBuffer[0];
                setChatResponse((prev) => prev + nextChar);
                return prevBuffer.slice(1);
            });
        }, 15); // ms per character

        return () => clearInterval(interval);
    }, [buffer]);


    useEffect(() => {
        if (playersData) {
            setPlayers(playersData.players.slice(0,10));
        }
    }, [playersData]);
    // useEffect(() => {

    //     fetchData()
    //         .then(data => {
    //             const subsetOfPlayers = data.players.slice(0,10);
    //             setPlayers(subsetOfPlayers)
    //             console.log(subsetOfPlayers)
    //         })
    // }, []);

    const handleSearchById = (input) => {

        if (validateId(input)) {
            // do something
        }
    }

    const handleSearchByCountry = (input) => {

        if (validateCountryCode(input)) {
            // do something
        }
    }

 return (
     <div className="player-results">
         <div className="player-results-header">
             <div className="player-results-search">
                 <label>Player id:</label>
                 <input type=""/>
                 <button onClick={handleSearchById}>Submit</button>
             </div>
             <div className="player-results-search">
                 <label >Player Country Code:</label>
                 <input type=""/>
                 <button onClick={()=>{}}>Submit</button>
             </div>
         </div>
         <div className="players-results-section">
             {/* Body of results should go here */}
             {players.map((player) => {
                 return(
                     <div style={{"display": "flex", "gap": "1vh"}}>
                        <div>{player.playerId}</div>
                        <div>{player.birthCountry}</div>
                     </div>
                 )
             })}
         </div>

         <div style={{ padding: '10px' }}>
            <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} style={{ width: '500px', marginBottom: '30px' }}/>
            <button onClick={handleChat} disabled={chatLoading}>Submit</button>
            {chatLoading && <div>Loading...</div>}
            <div dangerouslySetInnerHTML={{__html: chatResponse.replaceAll('\n', '<br />')}}></div>
         </div>


    </div>
 )
}

export default PlayerResults;
