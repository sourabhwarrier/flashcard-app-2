#IMPORTS BEGIN
from distutils.log import debug
from flask import Flask,session,render_template,request,redirect,g,url_for
from flask_security import Security,login_required,login_user
from flask_security.utils import hash_password
from flask_restful import Api
from models.models import User, user_datastore
import os
from application.configuration import appConfig
from db.database import db
from api.api import UserValAPI

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
    #try:
        #print(g.user)
    if request.method == "POST":
        if request.get_json()['context'] == 'SIGNIN':
            user_datastore.create_user(username=request.get_json()["username"],email=request.get_json()["email"],password=hash_password(request.get_json()["password"]))
            db.session.commit()
            user = User(username=request.get_json()["username"],email=request.get_json()["email"],password=hash_password(request.get_json()["password"]))
            login_user(user)
            return render_template('dashboard.html')
    if request.method == 'GET':
        #if g.user:
    #session.clear()
        return render_template("root.html")
    #except:
        #return render_template("error.html")



# API RESOURCES
api.add_resource(UserValAPI,"/validate")



# ROUTE FOR DASHBOARD
@app.route('/dashboard',methods=["GET","POST"])
@login_required
def dashboard():
    return render_template("dashboard.html")









# ENTRY POINT
@app.before_request
def before_request():
    g.user = None
    if 'user' in session:
        g.user = session['user']
if __name__== "__main__":
    app.run(debug=True)