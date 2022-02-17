from db.database import db
from models.models import User
from sqlalchemy import *
import random
#import matplotlib.pyplot as plt
#import base64
#from io import BytesIO

def username_in_use(username):
    user = db.session.query(User).filter(User.username==username).first()
    if user == None:
        return False
    else:
        return True

def email_in_use(email):
    user = db.session.query(User).filter(User.email==email).first()
    if user == None:
        return False
    else:
        return True
        