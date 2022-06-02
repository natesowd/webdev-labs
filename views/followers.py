from flask import Response, request
from flask_restful import Resource
from models import Following
import json

def get_path():
    return request.host_url + 'api/posts/'

class FollowerListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        '''
        People who are following the current user.
        In other words, select user_id where following_id = current_user.id
        '''
        followers = Following.query.filter(Following.following_id == self.current_user.id).all()
        #print(followers)
        #followers = Following.query.filter_by(id = following_id).all()
        #follows = self.current_user.following_id
        #followers = Following.query.filter(Following.user_id.in_(follows)).all()
        return Response(json.dumps([follower.to_dict_follower() for follower in followers]), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        FollowerListEndpoint, 
        '/api/followers', 
        '/api/followers/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )