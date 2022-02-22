from logging import error
from flask_restful import Resource
from flask import request,jsonify
from flask_security.utils import hash_password
from datetime import datetime
from controllers.functions_1 import email_exists, get_user_by_username, sha3512, username_exists


class UserValAPI(Resource):
    def get(self):
        pass
    def put(self):
        pass
    def post(self):
        print("DEBUG : UserValAPI : post ",request.get_json())
        #try:
        a,b = username_exists(request.get_json()['username']),email_exists(request.get_json()['email'])
        response_obj = {'username_in_use':a,'email_in_use':b},200
        return response_obj
        #except:
            #return "INTERNAL SERVER ERROR",500
    def delete(self):
        pass

class UserLoginAPI(Resource):
    def get(self):
        pass
    def put(self):
        pass
    def post(self):
        print("DEBUG : UserLoginAPI : post ",request.get_json())
        #try:
        user = get_user_by_username(request.get_json()["username"])
        print(user.password)
        print(sha3512(request.get_json()["password"]))
        if sha3512(request.get_json()["password"]) == user.password:
            b = True
        else:
            b = False
        a = username_exists(request.get_json()['username'])
        print(a)
        response_obj = {"user_exists":a,"password_correct":b},200
        return response_obj
        #except:
            #return "INTERNAL SERVER ERROR",500
    def delete(self):
        pass