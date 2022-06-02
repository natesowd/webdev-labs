from dotenv import load_dotenv
load_dotenv()
from flask import Flask, request
from flask_restful import Api
from flask_cors import CORS
from flask import render_template
import os
from sqlalchemy import and_
from models import db, Post, User, Following, ApiNavigator, Story
from views import initialize_routes, get_authorized_user_ids
import fake_data


app = Flask(__name__)
#app = Flask(__name__, 
 #           static_folder='/static')

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URL')
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False    


db.init_app(app)
api = Api(app)

# set logged in user
with app.app_context():
    app.current_user = User.query.filter_by(id=12).one()


# Initialize routes for all of your API endpoints:
initialize_routes(api)

# Server-side template for the homepage:
@app.route('/')
def home():
    current_user = fake_data.generate_user()
    return render_template(
        'starter-client copy.html', 
        user = app.current_user.to_dict(), # user = app.current_user / remember this change
        posts=fake_data.generate_posts(n=8),
        stories=fake_data.generate_stories(n=6),
        suggestions=fake_data.generate_suggestions(n=7)
    )

@app.route('/lab6')
def lab6():
    current_user = fake_data.generate_user()
    return render_template(
        'lab6.html', 
        user=app.current_user, # user = app.current_user / remember this change
    )



@app.route('/api')
@app.route('/api/')
def api_docs():
    navigator = ApiNavigator(app.current_user)
    return render_template(
        'api/api_docs.html', 
        user=app.current_user,
        endpoints=navigator.get_endpoints(),
        url_root=request.url_root[0:-1] # trim trailing slash
    )



# enables flask app to run using "python3 app.py"
if __name__ == '__main__':
    app.run()
