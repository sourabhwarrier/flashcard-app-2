from celery_async.celery_async_functions import update_deckstats_async, update_participation_async, update_rating_async
from flask_restful import Resource
from flask import request
from flask_security import current_user, login_user
from datetime import datetime
from functions.functions_1 import add_card, add_deck, check_if_deck_owner, delete_card, delete_deck, email_exists, export_deck, get_cards_by_deck, get_deck_by_deck_id, get_decks_for_dashboard, get_decks_for_user, get_user_by_username, load_decks_quiz_selector, question_gen, quick_quiz_score, sha3512, update_deck, update_deckstats, update_participation, update_rating, username_exists
from models.models import Card, Deck, User, user_datastore
from db.database import db
import time

# USER VALIDATION API
class UserValAPI(Resource):
    def get(self):
        print("DEBUG : UserValAPI : GET ")
        #try:
        a,b = username_exists(request.headers['username']),email_exists(request.headers['email'])
        response_obj = {'username_in_use':a,'email_in_use':b},200
        return response_obj
        #except:
            #return "INTERNAL SERVER ERROR",500
    def put(self):
        pass
    def post(self):
        print("DEBUG : UserValAPI : post ",request.get_json())
        #try:
        a,b = username_exists(request.get_json()['username']),email_exists(request.get_json()['email'])
        #response_obj = {'username_in_use':a,'email_in_use':b},200
        if not a and not b:
            user_datastore.create_user(username=request.get_json()["username"],email=request.get_json()["email"],password=sha3512(request.get_json()["password"]))
            db.session.commit()
            user = get_user_by_username(request.get_json()["username"])
            print(user)
            login_user(user)
            return {'success':True,'auth-token':sha3512(user.fs_uniquifier)}
        else:
            return {'success':False}
        #except:
            #return "INTERNAL SERVER ERROR",500
    def delete(self):
        pass

# USER LOGIN API
class UserLoginAPI(Resource):
    def get(self):
        print("DEBUG : UserLoginAPI : post ")
        #try:
        user = get_user_by_username(request.headers["username"])
        if user != None:
            print(user.password)
            print(sha3512(request.headers["password"]))
            if sha3512(request.headers["password"]) == user.password:
                b = True
            else:
                b = False
            a = username_exists(request.headers['username'])
            print(a)
        else:
            a,b = False,False
        response_obj = {"user_exists":a,"password_correct":b},200
        return response_obj
        #except:
            #return "INTERNAL SERVER ERROR",500
    def put(self):
        pass
    def post(self):
        print("DEBUG : UserLoginAPI : post ",request.get_json())
        #try:
        user = get_user_by_username(request.get_json()["username"])
        if user != None:
            print(user.password)
            print(sha3512(request.get_json()["password"]))
            if sha3512(request.get_json()["password"]) == user.password:
                b = True
            else:
                b = False
            a = username_exists(request.get_json()['username'])
            print(a)
        else:
            a,b = False,False
        if a and b:
            user = get_user_by_username(request.get_json()["username"])
            print(user)
            login_user(user)
            return {'success':True,'auth-token':sha3512(user.fs_uniquifier)}
        else:
            return {'success':False}
        #except:
            #return "INTERNAL SERVER ERROR",500
    def delete(self):
        pass


# WHOAMI API
class WhoamiAPI(Resource):
    def get(self):
        print(current_user.is_authenticated)
        if current_user.is_authenticated:
            if request.headers['auth-token'] == sha3512(current_user.fs_uniquifier):
                return {"authenticated": True,"username":current_user.username,'user_id':current_user.id},200
            else:
                return {"authenticated": False,"username":current_user.username},200
        else:
            return {"authenticated": False,"username":None},200
    def put(self):
        pass
    def post(self):
        pass
    def delete(self):
        pass


# DASHBOARD API
class PopulateDashboardAPI(Resource):
    def get(self):
        client = request.headers["user_id"]
        print("client : " ,client)
        print(current_user.id)
        print(str(current_user.id) == str(client))
        print("auth in dpa: ",current_user.is_authenticated)
        if current_user.is_authenticated and str(current_user.id) == str(client):
            if request.headers['auth-token'] == sha3512(current_user.fs_uniquifier):
                deckstats = get_decks_for_dashboard(current_user.id)
                print("deck fetched ", deckstats)
                return {'authenticated':True,'deck_stats':deckstats},200
            else:
                return {"authenticated": False,"username":current_user.username},200
        else:
            return {"authenticated": False,"username":None},200
    def put(self):
        pass
    def post(self):
        pass
    def delete(self):
        pass


# DEKCS API
class DecksAPI(Resource):
    def get(self):
        client = request.headers["user_id"]
        print("client : " ,client)
        print(current_user.id)
        print(str(current_user.id) == str(client))
        print("auth in dpa: ",current_user.is_authenticated)
        purpose = request.headers['purpose']
        if current_user.is_authenticated and str(current_user.id) == str(client):
            if request.headers['auth-token'] == sha3512(current_user.fs_uniquifier):
                decks = get_decks_for_user(current_user.id,purpose)
                print("deck fetched ", decks)
                return {'authenticated':True,'decks':decks},200
            else:
                {"authenticated": False,"username":current_user.username},200
        else:
            return {"authenticated": False,"username":None},200
    def put(self):
        pass
    def post(self):
        pass
    def delete(self):
        pass


# Cards API
class CardsAPI(Resource):
    def get(self):
        client = request.headers["user_id"]
        print("client : " ,client)
        print(current_user.id)
        print(str(current_user.id) == str(client))
        print("auth in dpa: ",current_user.is_authenticated)
        deck_id = request.headers['deck_id']
        print("requested deck : ",deck_id)
        if current_user.is_authenticated and str(current_user.id) == str(client):
            if request.headers['auth-token'] == sha3512(current_user.fs_uniquifier):
                deck = get_deck_by_deck_id(deck_id)
                if str(deck.owner) == client or deck.visibility == "Public":
                    cards = get_cards_by_deck(deck_id)
                    editable,deck_name,deck_description,visibility=check_if_deck_owner(deck_id,client)
                    print("deck fetched ", cards)
                    print("editable", editable)
                    return {'authenticated':True,'cards':cards,'editable':editable,'deck_name':deck_name,'deck_description':deck_description,'visibility':visibility},200
                else:
                   return {"authenticated": False,"username":current_user.username},200
            else:
                {"authenticated": False,"username":current_user.username},200
        else:
            return {"authenticated": False,"username":None},200
    def put(self):
        pass
    def post(self):
        client = request.headers["user_id"]
        print("client : " ,client)
        print(current_user.id)
        print(str(current_user.id) == str(client))
        print("auth in dpa: ",current_user.is_authenticated)
        if current_user.is_authenticated and str(current_user.id) == str(client):
            if request.headers['auth-token'] == sha3512(current_user.fs_uniquifier):
                deck_id = request.get_json()['deck_id']
                question = request.get_json()['question']
                hint = request.get_json()['hint']
                answer = request.get_json()['answer']
                new_card = Card(deck_id=deck_id,question=question,hint=hint,answer=answer)
                try:
                    add_card(new_card)
                    return {'authenticated':True,'success':True},200
                except:
                    return {'authenticated':True,'success':False}
            else:
                {"authenticated": False,"username":current_user.username},200
        else:
            return {"authenticated": False,"username":None},200
    def delete(self):
        client = request.get_json()["user_id"]
        print("client : " ,client)
        print(current_user.id)
        print(str(current_user.id) == str(client))
        print("auth in dpa: ",current_user.is_authenticated)
        if current_user.is_authenticated and str(current_user.id) == str(client):
            if request.headers['auth-token'] == sha3512(current_user.fs_uniquifier):
                card_ids = request.get_json()['card_ids']
                try:
                    print('to delete cards: ',card_ids)
                    for card_id in card_ids:
                        delete_card(int(card_id))
                    return {'authenticated':True,'success':True},200
                except:
                    return {'authenticated':True,'success':False}
            else:
                {"authenticated": False,"username":current_user.username},200
        else:
            return {"authenticated": False,"username":None},200


# DECK VISIBILITY API
class DeckVisibilityAPI(Resource):
    def get(self):
        pass
    def put(self):
        pass
    def post(self):
        client = request.get_json()["user_id"]
        print("client : " ,client)
        print(current_user.id)
        print(str(current_user.id) == str(client))
        print("auth in dpa: ",current_user.is_authenticated)
        if current_user.is_authenticated and str(current_user.id) == str(client):
            if request.headers['auth-token'] == sha3512(current_user.fs_uniquifier):
                deck = db.session.query(Deck).filter(Deck.deck_id==request.get_json()['deck_id']).first()
                if deck != None and deck.owner == request.get_json()['user_id']:
                    deck.visibility = request.get_json()['new_visibility']
                    db.session.query(Deck).filter(Deck.deck_id==request.get_json()['deck_id']).update({'visibility':deck.visibility})
                    db.session.commit()
                    print('changed visibility for deck : {} from {} to {}'.format(request.get_json()['deck_id'],request.get_json()['current_visibility'],deck.visibility))
                    return {'authenticated':True},200
                else:
                    return {'authenticated':False},304
            else:
                {"authenticated": False,"username":current_user.username},200
        else:
            return {"authenticated": False,"username":None},200
    def delete(self):
        pass



# DECK API CORE
class DeckAPI(Resource):
    def get(self):
        pass
    def put(self):
        client = request.get_json()["user_id"]
        print("client : " ,client)
        print(current_user.id)
        print(str(current_user.id) == str(client))
        print("auth in dpa: ",current_user.is_authenticated)
        if current_user.is_authenticated and str(current_user.id) == str(client):
            if request.headers['auth-token'] == sha3512(current_user.fs_uniquifier):
                deck_id = request.get_json()['deck_id']
                deck_name = request.get_json()['deck_name']
                deck_description = request.get_json()['deck_description']
                visibility = request.get_json()['visibility']
                if check_if_deck_owner(deck_id,client):
                    try:
                        update_deck(deck_id,deck_name,deck_description,visibility)
                        return {'authenticated':True,'success':True},200
                    except:
                        return {'authenticated':True,'success':False}
                else:
                    {"authenticated": False,"username":current_user.username},200
            else:
                {"authenticated": False,"username":current_user.username},200
        else:
            return {"authenticated": False,"username":None},200
    def post(self):
        client = request.get_json()["user_id"]
        print("client : " ,client)
        print(current_user.id)
        print(str(current_user.id) == str(client))
        print("auth in dpa: ",current_user.is_authenticated)
        if current_user.is_authenticated and str(current_user.id) == str(client):
            if request.headers['auth-token'] == sha3512(current_user.fs_uniquifier):
                deck_name = request.get_json()['deck_name']
                deck_description = request.get_json()['deck_description']
                visibility = request.get_json()['visibility']
                owner = client
                new_deck = Deck(name=deck_name,description=deck_description,owner=owner,visibility=visibility)
                try:
                    add_deck(new_deck)
                    return {'authenticated':True,'success':True},200
                except:
                    return {'authenticated':True,'success':False}
            else:
                {"authenticated": False,"username":current_user.username},200
        else:
            return {"authenticated": False,"username":None},200
    def delete(self):
        client = request.get_json()["user_id"]
        print("client : " ,client)
        print(current_user.id)
        print(str(current_user.id) == str(client))
        print("auth in dpa: ",current_user.is_authenticated)
        if current_user.is_authenticated and str(current_user.id) == str(client):
            if request.headers['auth-token'] == sha3512(current_user.fs_uniquifier):
                deck_ids = request.get_json()['deck_ids']
                #try:
                print('to delete : ',deck_ids)
                for deck_id in deck_ids:
                    delete_deck(int(deck_id))
                return {'authenticated':True,'success':True},200
                #except:
                #    return {'authenticated':True,'success':False}
            else:
                {"authenticated": False,"username":current_user.username},200
        else:
            return {"authenticated": False,"username":None},200



# QuizLoader API
class QuizLoader(Resource):
    def get(self):
        client = request.headers["user_id"]
        print("client : " ,client)
        print(current_user.id)
        print(str(current_user.id) == str(client))
        print("auth in dpa: ",current_user.is_authenticated)
        if current_user.is_authenticated and str(current_user.id) == str(client):
            if request.headers['auth-token'] == sha3512(current_user.fs_uniquifier):
                try:
                    decks = load_decks_quiz_selector(client)
                    return {'authenticated':True,'success':True,'decks':decks},200
                except:
                    return {'authenticated':True,'success':False},200
            else:
                {"authenticated": False,"username":current_user.username},200
        else:
            return {"authenticated": False,"username":None},200
    def put(self):
        pass
    def post(self):
        pass
    def delete(self):
        pass


# Quiz API
class QuizManager(Resource):
    def get(self):
        client = request.headers["user_id"]
        print("client : " ,client)
        print(current_user.id)
        print(str(current_user.id) == str(client))
        print("auth in dpa: ",current_user.is_authenticated)
        if current_user.is_authenticated and str(current_user.id) == str(client):
            if request.headers['auth-token'] == sha3512(current_user.fs_uniquifier):
                try:
                    deck_id=request.headers['deck_id']
                    questions = question_gen(deck_id)
                    return {'authenticated':True,'success':True,'questions':questions,'length':len(questions)},200
                except:
                    return {'authenticated':True,'success':False},200
            else:
                {"authenticated": False,"username":current_user.username},200
        else:
            return {"authenticated": False,"username":None},200
    def put(self):
        pass
    def post(self):
        client = request.headers["user_id"]
        deck_id = request.get_json()["deck_id"]
        submission = request.get_json()["submission"]
        rating = request.get_json()["rating"]
        print("client : " ,client)
        print(current_user.id)
        print(str(current_user.id) == str(client))
        print("auth in dpa: ",current_user.is_authenticated)
        if current_user.is_authenticated and str(current_user.id) == str(client):
            if request.headers['auth-token'] == sha3512(current_user.fs_uniquifier):
                #try:
                deck_id = request.get_json()["deck_id"]
                submission = request.get_json()["submission"]
                rating = request.get_json()["rating"]
                now = int(time.time())
                correct,total = quick_quiz_score(deck_id,submission)
                percentage = round(correct/total*100,2)
                if rating:
                    update_rating_async.delay(deck_id,rating)
                print(deck_id,submission,rating)
                update_deckstats_async.delay(client,deck_id,now,percentage)
                update_participation_async.delay(client)
                return {'authenticated':True,'success':True,'correct':correct,'total':total,'percentage':percentage},200
                #except:
                #    return {'authenticated':True,'success':False},200
            else:
                {"authenticated": False,"username":current_user.username},200
        else:
            return {"authenticated": False,"username":None},200
    def delete(self):
        pass



# DECKEXPORT API
class ExportDeck(Resource):
    def get(self):
        client = request.headers["user_id"]
        deck_id = request.headers["deck_id"]
        print("client : " ,client)
        print(current_user.id)
        print(str(current_user.id) == str(client))
        print("auth in dpa: ",current_user.is_authenticated)
        if current_user.is_authenticated and str(current_user.id) == str(client):
            if request.headers['auth-token'] == sha3512(current_user.fs_uniquifier):
                try:
                    endpoint = sha3512(str(time.time()))
                    export_deck(client,deck_id,endpoint)
                    return {"authenticated": True,'success':True,'endpoint':endpoint},200
                except:
                    return {"authenticated": True,'success':False},200
            else:
                return {"authenticated": False,"username":current_user.username},200
        else:
            return {"authenticated": False,"username":None},200
    def put(self):
        pass
    def post(self):
        pass
    def delete(self):
        pass