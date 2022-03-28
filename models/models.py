import email
from flask_security import SQLAlchemyUserDatastore,UserMixin,RoleMixin
from sqlalchemy.sql.schema import Column
from db.database import db

role_user_relation = db.Table("roles_users",
Column("user_id", db.Integer,db.ForeignKey("users.id")),
Column("role_id", db.Integer,db.ForeignKey("roles.id")))

class User(db.Model,UserMixin):
    __tablename__ = "users"
    id = Column(db.Integer,primary_key=True,autoincrement=True)
    email = Column(db.String,unique=True,nullable=False)
    username = Column(db.String,unique=True,nullable=False)
    password = Column(db.String,nullable=False)
    active = Column(db.Boolean)
    confirmed_at = Column(db.DateTime)
    fs_uniquifier = Column(db.String,nullable=False,unique=True)
    roles = db.relationship(
        'Role',
        secondary=role_user_relation,
        backref=db.backref('users',lazy='dynamic')
    )

class Role(db.Model,RoleMixin):
    __tablename__ = "roles"
    id = Column(db.Integer,primary_key=True)
    name = Column(db.String,nullable=False)
    description = Column(db.String)

'''class Card(db.Model):
    __tablename__ = "cards"
    card_id = Column(db.Integer,primary_key=True,autoincrement=True)
    question = Column(db.String,nullable=False)
    answer = Column(db.String,nullable=False)
    deck_id = Column(db.Integer, db.ForeignKey("decks.deck_id"),nullable=False)
'''
class Deck(db.Model):
    __tablename__ = "decks"
    deck_id = Column(db.Integer,primary_key=True,autoincrement=True)
    name = Column(db.String,nullable=False)
    description = Column(db.String,nullable=True)
    owner = Column(db.Integer, db.ForeignKey("users.id"),nullable=False)
    visibility = Column(db.String, nullable=False)

class Card(db.Model):
    __tablename__ = "cards"
    card_id = Column(db.Integer,primary_key=True,autoincrement=True)
    deck_id = Column(db.Integer, db.ForeignKey("decks.deck_id"),nullable=False)
    question = Column(db.String,nullable=False)
    hint = Column(db.String,nullable=True)
    answer = Column(db.String, nullable=False)

class DeckStat(db.Model):
    __tablename__ = "deckstats"
    id = Column(db.Integer,primary_key=True,autoincrement=True)
    deck_id = Column(db.Integer, db.ForeignKey("decks.deck_id"),nullable=False)
    user_id = Column(db.Integer, db.ForeignKey("users.id"),nullable=False)
    last_reviewed = Column(db.String,nullable=True)
    times_reviewed = Column(db.String,nullable=True)
    average_score = Column(db.String,nullable=True)

class Rating(db.Model):
    __tablename__ = "ratings"
    id = Column(db.Integer,primary_key=True,autoincrement=True)
    deck_id = Column(db.Integer, db.ForeignKey("decks.deck_id"),nullable=False)
    rating = Column(db.String,nullable=False)

class Participation(db.Model):
    __tablename__ = "participation"
    id = Column(db.Integer,primary_key=True,autoincrement=True)
    user_id = Column(db.Integer, db.ForeignKey("users.id"),nullable=False)
    last_revised = Column(db.String,nullable=False)

class Performance(db.Model):
    __tablename__ = "performances"
    id = Column(db.Integer,primary_key=True,autoincrement=True)
    user_id = Column(db.Integer, db.ForeignKey("users.id"),nullable=False)
    deck_id = Column(db.Integer, db.ForeignKey("decks.deck_id"),nullable=False)
    score = Column(db.String,nullable=False)

user_datastore = SQLAlchemyUserDatastore(db,User,Role)