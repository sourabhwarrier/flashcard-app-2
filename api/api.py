from logging import error
from flask_restful import Resource
from flask import request,jsonify
from datetime import datetime
from controllers.functions_1 import email_in_use, username_in_use


class UserValAPI(Resource):
    def get(self):
        pass
    def put(self):
        pass
    def post(self):
        print("DEBUG : UserValAPI : post ",request.get_json())
        #try:
        a,b = username_in_use(request.get_json()['username']),email_in_use(request.get_json()['email'])
        response_obj = {'username_in_use':a,'email_in_use':b},200
        return response_obj
        #except:
            #return "INTERNAL SERVER ERROR",500
    def delete(self):
        pass