import os
class appConfig():
    SQLALCHEMY_DATABASE_URI = "sqlite:///data/database.sqlite3"
    SECURITY_PASSWORD_SALT = "abcdefg"
    DEBUG = True