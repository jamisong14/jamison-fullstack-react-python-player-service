from app import db
from sqlalchemy.orm import validates

class Player(db.Model):
  playerId = db.Column(db.String(10), primary_key=True, required=True)
  name = db.Column(db.String(100), required=True)
  position = db.Column(db.String(100), required=True)
  team = db.Column(db.String(100), required=True)
  birthDate = db.Column(db.String(100), required=True)
  height = db.Column(db.String(100), required=True)
  weight = db.Column(db.String(100), required=True)
  bats = db.Column(db.String(100), required=True)
  throws = db.Column(db.String(100), required=True)

  def __repr__(self):
    return f"<Player {self.playerId}>"