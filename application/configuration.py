import os
class appConfig():
    SQLALCHEMY_DATABASE_URI = "sqlite:///data/database.sqlite3"
    SECURITY_PASSWORD_SALT = os.urandom(24)
    DEBUG = True