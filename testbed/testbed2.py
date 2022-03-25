from celery import Celery
import time
from application.configuration import appConfig

# SETUP
broker_url = appConfig.CELERY_BROKER_URL
celery = Celery('testbed', broker=broker_url)


# TASKS BEGIN HERE

@celery.task()
def fun(n):
    print("starting")
    time.sleep(n)
    print("done!!")
    return n
