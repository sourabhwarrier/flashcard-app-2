from datetime import timedelta
from pickle import FALSE
from celery.schedules import crontab
import os
class appConfig():
    SQLALCHEMY_TRACK_MODIFICATIONS=False
    SQLALCHEMY_DATABASE_URI = "sqlite:///data/database.sqlite3"
    SECURITY_PASSWORD_SALT = "abcdefg"
    DEBUG = True
    CELERY_BROKER_URL='redis://localhost:6379'
    RESULT_BACKEND='redis://localhost:6379'
    BROKER_TRANSPORT_OPTIONS = {'visibility_timeout': 31540000}
    BEAT_SCHEDULE = {
        'daily_revision_reminder':{
            'task':'celery_async.reminder_async',
            #'schedule':crontab(hour=17,minute=1),
            'schedule':crontab(minute=3),
            'args':()
        },
        'monthly_report_dispatch':{
            'task':'celery_async.dispatch_monthly_report',
            'schedule':crontab(day_of_month=1,hour=0,minute=0),
            'args':()
        }
    }