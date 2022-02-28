from ast import Pass
from logging import error
from flask_restful import Resource
from flask import request,jsonify
from flask_security import current_user, login_user, logout_user
from datetime import datetime
from controllers.functions_1 import email_exists, get_decks_for_dashboard, get_user_by_username, sha3512, username_exists
from models.models import User, user_datastore
from db.database import db

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
            return {'success':True}
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
            return {'success':True}
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
            return {"authenticated": True,"username":current_user.username,'user_id':current_user.id},200
        else:
            return {"authenticated": False,"username":None},200
    def put(self):
        pass
    def post(self):
        pass
    def delete(self):
        pass


# WHOAMI API
class PopulateDashboardAPI(Resource):
    def get(self):
        client = request.headers["user_id"]
        print("client : " ,client)
        print(current_user.id)
        print(str(current_user.id) == str(client))
        print("auth in dpa: ",current_user.is_authenticated)
        if current_user.is_authenticated and str(current_user.id) == str(client):
            decks = get_decks_for_dashboard(current_user.id)['decks']
            print("deck fetched ", decks)
            return {'deck_stats':decks},200
        else:
            return {"authenticated": False,"username":None},200
    def put(self):
        pass
    def post(self):
        pass
    def delete(self):
        pass