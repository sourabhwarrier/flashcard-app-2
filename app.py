#IMPORTS BEGIN
from distutils.log import debug
from controllers.functions_1 import get_user_by_username, sha3512
from flask import Flask,session,render_template,request,redirect,g,url_for
from flask_security import Security,login_required,login_user,logout_user,current_user
from flask_security.utils import hash_password
from flask_restful import Api
from models.models import User, user_datastore
import os
from application.configuration import appConfig
from db.database import db
from api.api import UserLoginAPI, UserValAPI

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
@app.route('/',methods=["GET","POST"])
def root():
    print("User logged in : ",current_user.is_authenticated)
    try:
        if not current_user.is_authenticated:
            if request.method == "POST":
                if request.get_json()['context'] == 'LOGIN':
                    user = get_user_by_username(request.get_json()["username"])
                    print("Logging in user : ",user)
                    login_user(user)
                    return redirect(url_for('dashboard'))
                if request.get_json()['context'] == 'SIGNIN':
                    user_datastore.create_user(username=request.get_json()["username"],email=request.get_json()["email"],password=sha3512(request.get_json()["password"]))
                    db.session.commit()
                    user = get_user_by_username("user1")
                    print(user)
                    login_user(user)
                    return redirect(url_for('dashboard'))
            elif request.method == 'GET':
                return render_template("root.html")
        else:
            return redirect(url_for("dashboard"))
    except:
        return redirect(url_for("error.html"))

# ROUTE FOR DASHBOARD
@app.route('/dashboard',methods=["GET","POST"])
def dashboard():
    if current_user.is_authenticated:
        print("User logged in : ",current_user.is_authenticated)
        return render_template("dashboard.html")
    else:
        print("User logged in : ",current_user.is_authenticated)
        return redirect(url_for("root"))
    #except:
    #    return redirect(url_for("error.html"))




# ENTRY POINT
@app.before_request
def before_request():
    g.user = None
    if 'user' in session:
        g.user = session['username']

# API RESOURCES
api.add_resource(UserValAPI,"/api-validate")
api.add_resource(UserLoginAPI,"/api-login")

if __name__== "__main__":
    app.run(debug=True)