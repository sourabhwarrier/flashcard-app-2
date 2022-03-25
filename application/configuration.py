import os
class appConfig():
    SQLALCHEMY_DATABASE_URI = "sqlite:///data/database.sqlite3"
    SECURITY_PASSWORD_SALT = "abcdefg"
    DEBUG = True
    CELERY_BROKER_URL='redis://localhost:6379'
    CELERY_RESULT_BACKEND='redis://localhost:6379'