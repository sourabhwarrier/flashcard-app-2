from celery import Celery
from application.configuration import appConfig
from functions.functions_1 import *
import time

#broker = 
#celery = Celery('testbed', broker="redis://localhost:6379")