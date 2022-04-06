#IMPORTS BEGIN
from flask import Flask
from flask_security import Security
from celery import Celery
from flask_restful import Api
from models.models import user_datastore
import os
from application.configuration import appConfig
from db.database import db
from celery.schedules import crontab

#IMPORTS END


# FLASK INITIALIZATION BEGIN
def create_app():
    app = Flask(__name__)
    app.config.from_object(appConfig)
    db.init_app(app)
    api = Api(app)
    app.app_context().push()
    app.secret_key = os.urandom(24)
    return app, api

app,api = create_app()
security = Security(app,user_datastore)
# FLASK INITIALIZATION END

# CELERY INITIALIZATION BEGIN
def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=app.config['RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL'],
    )
    celery.conf.update(app.config)
    celery.conf.enable_utc = False
    celery.conf.time_zone = "Asia/Kolkata"
    celery.conf.beat_schedule = {
    "daily-reminder-async": {
    "task": "reminder_async",
    "schedule": crontab(minute="0",hour="0"),
     },
    "dispatch_monthly_report": {
    "task": "dispatch_monthly_report",
    "schedule": crontab(minute="0", hour="0"),
     },
    }



    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery
celery = make_celery(app)
# CELERY INITIALIZATION END