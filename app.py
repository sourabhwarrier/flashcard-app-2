#IMPORTS BEGIN
from crypt import methods
from distutils.log import debug
from controllers.functions_1 import get_decks_for_dashboard, get_user_by_username, sha3512
from flask import Flask,session,render_template,request,redirect,g,url_for,send_file
from flask_security import Security,login_required,login_user,logout_user,current_user
from flask_security.utils import hash_password
from flask_restful import Api
from models.models import User, user_datastore
import os
from application.configuration import appConfig
from db.database import db
from api.api import CardsAPI, DeckAPI, DeckVisibilityAPI, DecksAPI, ExportDeck, PopulateDashboardAPI, QuizManager, QuizLoader, UserLoginAPI, UserValAPI, WhoamiAPI

#IMPORTS END


# INITIALIZATION BEGIN
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
# INITIALIZATION END

# ROUTE FOR ROOT (LOGIN, SIGNIN, SIGNUP)
@app.route('/',methods=["GET"])
def root():
    print("User logged in : ",current_user.is_authenticated)
    try:
        if current_user.is_authenticated:
            return redirect(url_for('dashboard'))
        else:
            return render_template("root.html")
    except:
        return redirect(url_for("error"))

# ROUTE FOR DASHBOARD
@app.route('/dashboard',methods=["GET"])
def dashboard():
    try:
        if current_user.is_authenticated:
            print("User logged in : ",current_user.is_authenticated, " as : ", current_user.username)
            print(get_decks_for_dashboard(current_user.id))
            return render_template("dashboard.html")
        else:
            print("User logged in : ",current_user.is_authenticated)
            return redirect(url_for("root"))
    except:
        return redirect(url_for("error"))


# ROUTE FOR decks
@app.route('/decks',methods=["GET"])
def decks():
    try:
        if current_user.is_authenticated:
            print("User logged in : ",current_user.is_authenticated, " as : ", current_user.username)
            print(get_decks_for_dashboard(current_user.id))
            return render_template("decks.html")
        else:
            print("User logged in : ",current_user.is_authenticated)
            return redirect(url_for("root"))
    except:
        return redirect(url_for("error"))


# ROUTE FOR decks
@app.route('/quiz',methods=["GET"])
def quiz():
    try:
        if current_user.is_authenticated:
            print("User logged in : ",current_user.is_authenticated, " as : ", current_user.username)
            print(get_decks_for_dashboard(current_user.id))
            return render_template("quiz.html")
        else:
            print("User logged in : ",current_user.is_authenticated)
            return redirect(url_for("root"))
    except:
        return redirect(url_for("error"))


# ROUTE FOR ERROR
@app.route('/error', methods=["GET"])
def error():
    return render_template("error.html")


# ROUTE FOR DECK DOWNLOAD
@app.route('/proc-content/<filename>', methods=["GET"])
def deck_download(filename):
    try:
        return send_file("proc/{}.csv".format(filename),attachment_filename="deck")
    except:
        return redirect(url_for("error"))

# ENTRY
@app.before_request
def before_request():
    g.user = None
    if 'user' in session:
        g.user = session['username']

# API RESOURCES
api.add_resource(UserValAPI,"/api-validate")
api.add_resource(UserLoginAPI,"/api-login")
api.add_resource(WhoamiAPI,"/api-whoami")
api.add_resource(PopulateDashboardAPI,"/api-populate-dashboard")
api.add_resource(DecksAPI,"/api-load-all-decks")
api.add_resource(DeckVisibilityAPI,"/api-update-deck-visibility")
api.add_resource(DeckAPI,"/api-manage-decks")
api.add_resource(CardsAPI,"/api-manage-cards")
api.add_resource(QuizLoader,"/api-quiz-loader")
api.add_resource(QuizManager,"/api-quiz")
api.add_resource(ExportDeck,"/api-export-deck")


if __name__== "__main__":
    app.run(debug=True)