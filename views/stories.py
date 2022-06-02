from flask import Response
from flask_restful import Resource
from models import Story
from views import get_authorized_user_ids
import json

class StoriesListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        # get stories created by one of these users:
        # print(get_authorized_user_ids(self.current_user))
        follows = get_authorized_user_ids(self.current_user)
        #follows.append(self.current_user.id)
        stories = Story.query.filter(Story.user_id.in_(follows)).all()
        #stories.append(Story.query.filter(Story.id.in_(self.current_user.id)))
        #print(stories[0])
        return Response(json.dumps([story.to_dict() for story in stories]), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        StoriesListEndpoint, 
        '/api/stories', 
        '/api/stories/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
