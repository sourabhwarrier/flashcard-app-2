from db.database import db
from models.models import Deck, Participation, User,DeckStat
from sqlalchemy import *
import random
import hashlib
#import matplotlib.pyplot as plt
#import base64
#from io import BytesIO

def sha3512(password):
    m = hashlib.sha3_512()
    m.update(password.encode("utf-8"))
    return str(m.hexdigest())

def username_exists(username):
    user = db.session.query(User).filter(User.username==username).first()
    if user == None:
        return False
    else:
        return True

def email_exists(email):
    user = db.session.query(User).filter(User.email==email).first()
    if user == None:
        return False
    else:
        return True

def get_user_by_username(username):
    user = db.session.query(User).filter(User.username==username).first()
    return user

def get_user_by_id(user_id):
    user = db.session.query(User).filter(User.id==user_id).first()
    return user

def get_deck_by_deck_id(deck_id):
    deck = db.session.query(Deck).filter(Deck.deck_id==deck_id).first()
    return deck
def get_deckstat(user_id,deck_id):
    stat = db.session.query(DeckStat).filter(DeckStat.deck_id==deck_id,DeckStat.user_id==user_id).first()
    return stat




def get_decks_for_dashboard(user_id):
    deckstats = db.session.query(DeckStat).filter(DeckStat.user_id==user_id).all()
    deck_dict = {}
    deck_list = []
    for deckstat in deckstats:
        deck = get_deck_by_deck_id(deckstat.deck_id)
        owner = get_user_by_id(deck.owner).username
        visibility = deck.visibility
        name = deck.name
        description = deck.description
        average_score = deckstat.average_score
        times_reviewed = deckstat.times_reviewed
        last_reviewed = deckstat.last_reviewed
        deck_obj = {'owner':owner,
        'visibility':visibility,
        'name':name,
        'description':description,
        'average_score':average_score,
        'times_reviewed':times_reviewed,
        'last_reviewed':last_reviewed}
        deck_list.append(deck_obj)
    deck_dict['decks'] = deck_list
    return deck_dict
        