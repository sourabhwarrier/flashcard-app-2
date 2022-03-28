from db.database import db
from models.models import Card, Deck, Rating, User,DeckStat,Participation,Performance
from sqlalchemy import *
import random
import hashlib
from datetime import datetime
import os
import time
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
        rating=get_rating(deckstat.deck_id)
        times_reviewed = deckstat.times_reviewed
        last_reviewed = format_datetime(deckstat.last_reviewed)
        deck_obj = {'owner':owner,
        'visibility':visibility,
        'name':name,
        'description':description,
        'average_score':average_score,
        'rating':rating,
        'times_reviewed':times_reviewed,
        'last_reviewed':last_reviewed,
        'deck_id':deck_id,
        'number_of_cards':number_of_cards}
        if str(deck.owner) == str(user_id) or deck.visibility == "Public":
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
        deckstat = db.session.query(DeckStat).filter(DeckStat.deck_id==deck.deck_id).filter(DeckStat.user_id==user_id).first()
        if deckstat==None:
            last_reviewed='Never'
        else:
            last_reviewed=format_datetime(deckstat.last_reviewed)
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

def update_deck(deck_id,deck_name,deck_description,deck_visibility):
    db.session.query(Deck).filter(Deck.deck_id==deck_id).update({"name":deck_name,"description":deck_description,'visibility':deck_visibility})
    db.session.commit()

def delete_deck(deck_id):
    delete_rating(deck_id)
    delete_deckstats(deck_id)
    for card in get_cards_by_deck(deck_id):
        delete_card(card['card_id'])
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

def load_decks_quiz_selector(user_id):
    deck_list = []
    temp_decks = db.session.query(Deck).all()
    for deck in temp_decks:
        count = countcards(deck.deck_id)
        if count > 0:
            deckstat = db.session.query(DeckStat).filter(DeckStat.deck_id==deck.deck_id).filter(DeckStat.user_id==user_id).first()
            if deckstat==None:
                last_reviewed='Never'
            else:
                last_reviewed=format_datetime(deckstat.last_reviewed)
            deck_id = deck.deck_id
            number_of_cards = count
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
            #print("deck is owned : ",str(deck.owner)==str(user_id))
            #print(deck.owner)
            #print(user_id)
            #print("deck is public : ",deck.visibility=='Public')
            if str(deck.owner) == str(user_id) or deck.visibility == 'Public':
                deck_list.append(deck_obj)
    return deck_list


def format_datetime(unix):
    return datetime.utcfromtimestamp(int(unix)).strftime('%Y-%m-%d %H:%M:%S')


def question_gen(deck_id):
    cards = db.session.query(Card).filter(Card.deck_id==deck_id).all()
    #deck = db.session.query(Deck).filter(Deck.deck_id==deck_id).first()
    questions_set = []
    with open('data/wordlist.txt') as f:
        W = f.readlines()
        n = len(W)
        index = 1
        for card in cards:
            options = [card.answer]
            while len(options) < 4:
                idx = random.randint(0,n-1)
                print(idx)
                if W[idx] not in options and W[idx]:
                    options.append(W[idx].capitalize())
            random.shuffle(options)
            question_obj = {
            'card_id':card.card_id,
            'deck_id':card.deck_id,
            'index':index,
            'question':card.question,
            'hint':card.hint,
            'options':options}
            questions_set.append(question_obj)
    return questions_set
            #print("options generated : ",options)

def export_deck(user_id,deck_id,endpoint):
    cards = db.session.query(Card).filter(Card.deck_id==deck_id).all()
    if len(cards) > 0:
        lines = []
        for card in cards:
            question = card.question
            hint = card.hint
            answer = card.answer
            lines.append("{},{},{}\n".format(question,hint,answer))
        with open("proc/{}.csv".format(endpoint), 'a+') as f:
            for line in lines:
                f.write(line)
            
def quick_quiz_score(deck_id,submission):
    cards = db.session.query(Card).filter(Card.deck_id==deck_id).all()
    number_of_cards = len(cards)
    correct_cards = 0
    for sub in submission:
        card_id = sub["card_id"]
        reply = sub["reply"]
        card = [card for card in cards if card.card_id == card_id][0]
        if card.answer == reply:
            correct_cards+=1
    return correct_cards,number_of_cards


def update_rating(deck_id,rating):
    rating_dict={"Easy":"0","Medium":"1","Hard":"2"}
    rating_val = rating_dict[rating]
    rating_obj = Rating(deck_id=deck_id,rating=rating_val)
    db.session.add(rating_obj)
    db.session.commit()

def delete_rating(deck_id):
    db.session.query(Rating).filter(Rating.deck_id==deck_id).delete()
    db.session.commit()

def get_rating(deck_id):
    ratings = db.session.query(Rating).filter(Rating.deck_id==deck_id).all()
    if len(ratings) == 0:
        return "No rating yet"
    rating_val = sum([int(rating.rating) for rating in ratings])/len(ratings)
    if rating_val<0.7:
        rating_string="Easy"
    elif rating_val<1.4:
        rating_string="Medium"
    else:
        rating_string="Hard"
    return rating_string



def update_deckstats(user_id,deck_id,last_reviewed,score):
    deckstat = db.session.query(DeckStat).filter(DeckStat.user_id==user_id).filter(DeckStat.deck_id==deck_id).first()
    if deckstat == None:
        new_deckstat = DeckStat(user_id=user_id,deck_id=deck_id,last_reviewed=str(last_reviewed),average_score=str(score),times_reviewed="1")
        db.session.add(new_deckstat)
        db.session.commit()
    else:
        new_average_score = str(round((float(deckstat.average_score)*int(deckstat.times_reviewed)+float(score))/(int(deckstat.times_reviewed)+1),2))
        new_times_reviewed = str(int(deckstat.times_reviewed)+1)
        db.session.query(DeckStat).filter(DeckStat.user_id==user_id).filter(DeckStat.deck_id==deck_id).update({'last_reviewed':last_reviewed,'average_score':new_average_score,'times_reviewed':new_times_reviewed})
        db.session.commit()

def delete_deckstats(deck_id):
    db.session.query(DeckStat).filter(DeckStat.deck_id==deck_id).delete()
    db.session.commit()


def update_participation(user_id):
    older = db.session.query(Participation).filter(Participation.user_id==user_id).first()
    now = str(int(time.time()))
    if older == None:
        participation = Participation(user_id=user_id,last_revised=now)
        db.session.add(participation)
        db.session.commit()
    else:
        db.session.query(Participation).filter(Participation.user_id==user_id).update({'last_revised':now})
        db.session.commit()


def to_remind(user_id):
    participation = db.session.query(Participation).filter(Participation.user_id==user_id).first()
    if participation == None:
        return true
    else:
        now = int(time.time())
        last_revised = int(participation.last_revised)
        if now-last_revised>=61200:
            return true
        else:
            return false


def get_all_user_ids():
    users = db.session.query(User).all()
    return users