from flask_restful import Resource
from flask import request,jsonify
from datetime import datetime


class UserValAPI(Resource):
    def get(self):
        pass
    def put(self):
        pass
    def post(self):
        print(request.get_json())
        return {'valid': True},200
    def delete(self):
        pass