from flask import Response, request
from flask_restful import Resource
from models import User
from views import get_authorized_user_ids
import json

class SuggestionsListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        # suggestions should be any user with an ID that's not in this list:
        # print(get_authorized_user_ids(self.current_user))
        follows = get_authorized_user_ids(self.current_user)
        suggestions = User.query.filter(~User.id.in_(follows)).limit(7).all()
        return Response(json.dumps([sugg.to_dict() for sugg in suggestions]), mimetype="application/json", status=200)
        #Dosent work aquire assistance


def initialize_routes(api):
    api.add_resource(
        SuggestionsListEndpoint, 
        '/api/suggestions', 
        '/api/suggestions/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
