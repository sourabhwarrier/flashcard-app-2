from celery import Celery
from flask import Flask
import time
def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL'],
    )
    celery.conf.update(app.config)

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery

flask_app = Flask(__name__)
flask_app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379',
    CELERY_RESULT_BACKEND='redis://localhost:6379'
)
celery = make_celery(flask_app)

@celery.task(name="testbed")
def welcome(s):
    time.sleep(5)
    return s

@flask_app.route('/',methods=["GET"])
def func():
    result = welcome.delay("hello")
    #result.wait()
    return {"message":"hello"}

if __name__== '__main__':
    flask_app.run()