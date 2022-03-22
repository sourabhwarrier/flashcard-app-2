from db.database import db
from models.models import Card, Deck, User,DeckStat
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
    deck_list = []
    for deckstat in deckstats:
        number_of_cards = countcards(deckstat.deck_id)
        deck = get_deck_by_deck_id(deckstat.deck_id)
        owner = get_user_by_id(deck.owner).username
        visibility = deck.visibility
        name = deck.name
        deck_id=deck.deck_id
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
        'last_reviewed':last_reviewed,
        'deck_id':deck_id,
        'number_of_cards':number_of_cards}
        deck_list.append(deck_obj)
    return deck_list


def countcards(deck_id):
    cards = db.session.query(Card).filter(Card.deck_id==deck_id).all()
    return len(cards)
        

def get_decks_for_user(user_id,purpose):
    if purpose == 'all':
        decks = db.session.query(Deck).filter(or_(Deck.owner==user_id,Deck.visibility=='Public')).all()
    elif purpose == 'restricted':
        decks = db.session.query(Deck).filter(Deck.owner==user_id).all()
    deck_list = []
    for deck in decks:
        deckstat = db.session.query(DeckStat).filter(DeckStat.deck_id==deck.deck_id).first()
        if deckstat==None:
            last_reviewed='Never'
        else:
            last_reviewed=deckstat.last_reviewed
        deck_id = deck.deck_id
        number_of_cards = countcards(deck.deck_id)
        owner = get_user_by_id(deck.owner).username
        visibility = deck.visibility
        name = deck.name
        description = deck.description
        deck_obj = {'owner':owner,
        'visibility':visibility,
        'name':name,
        'description':description,
        'number_of_cards':number_of_cards,
        'deck_id':deck_id,
        'last_reviewed':last_reviewed}
        deck_list.append(deck_obj)
    return deck_list


def get_cards_by_deck(deck_id):
    deck = db.session.query(Deck).filter(Deck.deck_id==deck_id).first()
    cards = db.session.query(Card).filter(Card.deck_id==deck_id).all()
    card_list = []
    deck_name = deck.name
    for card in cards:
        card_id = card.card_id
        question = card.question
        hint = card.hint
        answer = card.answer
        card_obj = {'deck_id':deck_id,
        'card_id':card_id,
        'question':question,
        'hint':hint,
        'answer':answer,
        'deck_name':deck_name 
        }
        card_list.append(card_obj)
    return card_list

def add_card(card):
    cards = db.session.add(card)
    db.session.commit()


def delete_card(card_id):
    db.session.query(Card).filter(Card.card_id==card_id).delete()
    db.session.commit()

def add_deck(deck):
    db.session.add(deck)
    db.session.commit()

def delete_deck(deck_id):
    for card in get_cards_by_deck(deck_id):
        delete_card(card.card_id)
    db.session.query(Deck).filter(Deck.deck_id==deck_id).delete()
    db.session.commit()

def check_if_deck_owner(deck_id,user_id):
    deck = db.session.query(Deck).filter(Deck.deck_id==deck_id).first()
    if deck:
        print(deck.owner,user_id)
        if str(deck.owner) == str(user_id):
            return True,deck.name,deck.description,deck.visibility
        else:
            return False,deck.name,deck.description,deck.visibility
    else:
        return False,None