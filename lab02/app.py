from flask import Flask
from flask import render_template
from flask import request
import random
import json
import requests
from helpers import CurrentUser
from pprint import pprint

# initializes flask app:
app = Flask(__name__)

#########################
# some global variables #
#########################
current_user = CurrentUser(first_name='Erick', last_name='Rubi', email='erub03@gmail.com', username='erub03')
my_compliments = ["is to die for!", "outshines all competition!", "will leave you stuffed and satisfied!", "really raises the bar!", "will leave you only wanting more!", "is a great choice for the whole family!", "understands quality over quantity!", "nails both the quality and quantity!"]

quotes = (
    '“We May Encounter Many Defeats But We Must Not Be Defeated.” – Maya Angelou',
    '“The Way Get Started Is To Quit Talking And Begin Doing.” – Walt Disney',
    '“Security Is Mostly A Superstition. Life Is Either A Daring Adventure Or Nothing.” – Life Quote By Helen Keller',
    '“The Pessimist Sees Difficulty In Every Opportunity. The Optimist Sees Opportunity In Every Difficulty.” – Winston Churchill',
    '“Don’t Let Yesterday Take Up Too Much Of Today.” – Will Rogers',
    '“You Learn More From Failure Than From Success. Don’t Let It Stop You. Failure Builds Character.” – Unknown',
    '“If You Are Working On Something That You Really Care About, You Don’t Have To Be Pushed. The Vision Pulls You.” – Steve Jobs',
)

##############
# Exercise 1 #
##############
@app.route('/')
def exercise1():
    return "Hello " + current_user.first_name + " " + current_user.last_name + "!"


##############
# Exercise 2 #
##############
@app.route('/quote')
def exercise2():
    current_quote = random.choice(quotes)
    return render_template(
        'quote-of-the-day.html',
        user=current_user, quote=current_quote
    )

##############
# Exercise 3 #
##############
@app.route('/restaurant-data/')
@app.route('/restaurant-data')
def exercise3():
    args = request.args
    location = args.get('location')
    search_term = args.get('term')
    if not (location and search_term):
        return '"location" and "term" are required query parameters'
    
    url = 'https://www.apitutor.org/yelp/simple/v3/businesses/search?location={0}&term={1}'.format(location, search_term)
    response = requests.get(url)
    data = response.json()
    pprint(data) # for debugging -- prints the result to the command line

    return json.dumps(data)
##############
# Exercise 4 #
##############
@app.route('/restaurant/')
@app.route('/restaurant')
def exercise4():
    args = request.args
    location = args.get('location')
    search_term = args.get('term')
    if not (location and search_term):
        return '"location" and "term" are required query parameters'
    
    
    url = 'https://www.apitutor.org/yelp/simple/v3/businesses/search?location={0}&term={1}'.format(location, search_term)
    response = requests.get(url)
    restaurants = response.json()
    my_restaurant = restaurants[0].get("display_address").split(" ")
    add_on = ""
    for i in my_restaurant:
        add_on += i
        add_on += "+"
    add_on = add_on[:-1]
    #print(add_on)
    my_url = "https://www.google.com/maps/place/"
    my_url += add_on + "/"
    pprint(my_url)


    pprint(restaurants[0]) # for debugging
    return render_template(
        'restaurant.html',
        user=current_user,
        search_term=search_term.capitalize(),
        location=location,
        restaurant=restaurants[0],
        compliment=random.choice(my_compliments),
        loc_url=my_url
    )

@app.route('/cards/')
@app.route('/cards')
def photos_static():
    args = request.args
    location = args.get('location')
    search_term = args.get('term')
    if not (location and search_term):
        return '"location" and "term" are required query parameters'
    
    
    return render_template('cards.html')


    
