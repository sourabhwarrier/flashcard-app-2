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

def get_deckstat(user_id,deck_id):
    stat = db.session.query(DeckStat).filter(DeckStat.deck_id==deck_id,DeckStat.user_id==user_id).first()
    return stat


def get_decks_for_dashboard(user_id):
    showable_decks = db.session.query(Participation).filter(Participation.user_id==user_id).all()
    showable_deck_ids = [x.deck_id for x in showable_decks]
    decks = db.session.query(Deck).filter((Deck.owner==user_id) | (Deck.visibility=="public")).all()
    deck_dict = {}
    deck_list = []
    for deck in decks:
        if deck.deck_id in showable_deck_ids:
            username = get_user_by_id(deck.owner).username
            deck_obj = {'deck_id':deck.deck_id,'name':deck.name,'description':deck.description,'owner':username,'visibility':deck.visibility}
            deck_list.append(deck_obj)
    deck_dict['decks'] = deck_list
    if deck_dict['decks'] == []:
        return ''
    return deck_dict
        