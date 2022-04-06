from datetime import timedelta
from pickle import FALSE
import os
class appConfig():
    SQLALCHEMY_TRACK_MODIFICATIONS=False
    SQLALCHEMY_DATABASE_URI = "sqlite:///data/database.sqlite3"
    SECURITY_PASSWORD_SALT = "abcdefg"
    DEBUG = True
    #CELERY_ENABLE_UTC = False
    CELERY_BROKER_URL='redis://localhost:6379'
    RESULT_BACKEND='redis://localhost:6379'
    #BROKER_TRANSPORT_OPTIONS = {'visibility_timeout': 31540000}