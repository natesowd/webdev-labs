from flask import Response, request
from flask_restful import Resource
from models import Following, User, db
import json

def get_path():
    return request.host_url + 'api/posts/'

class FollowingListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        # return all of the "following" records that the current user is following
        following = Following.query.filter(Following.user_id == self.current_user.id).all()
        return Response(json.dumps([follower.to_dict_following() for follower in following]), mimetype="application/json", status=200)

    def post(self):
        # create a new "following" record based on the data posted in the body 
        body = request.get_json()
        if not body.get('user_id'):
            return Response(json.dumps({"message": "Error: no post id found"}), mimetype="application/json", status=400)
        try:
            id = int(body.get('user_id'))
        except:
            return Response(json.dumps({"message":"Error: please enter a valid id number"}), mimetype="application/json", status=400)
        
        if not User.query.get(id):
            return Response(json.dumps({"message":"Error: please enter a valid id number"}), mimetype="application/json", status=404)

    
        new_following = Following(
            self.current_user.id, # must be a valid user_id or will throw an error
            body.get('user_id')
        )
        try:
            db.session.add(new_following)    # issues the insert statement
            db.session.commit()
        except:
            return Response(json.dumps({"message": "Error: Duplicate Following"}), mimetype="application/json", status=400)

        return Response(json.dumps(new_following.to_dict_following()), mimetype="application/json", status=201)

class FollowingDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        following = Following.query.get(id)
        if not following:
            return Response(json.dumps({"message":"Error: please enter a valid id number"}), mimetype="application/json", status=404)
        
        if following.user_id != self.current_user.id:
            return Response(json.dumps({"message":"Error: please enter a valid id number"}), mimetype="application/json", status=404)

        Following.query.filter_by(id=id).delete()
        db.session.commit() 
        return Response(json.dumps({"message": "Following id = {0} was successfully deleted".format(id)}), mimetype="application/json", status=200)





def initialize_routes(api):
    api.add_resource(
        FollowingListEndpoint, 
        '/api/following', 
        '/api/following/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
    api.add_resource(
        FollowingDetailEndpoint, 
        '/api/following/<int:id>', 
        '/api/following/<int:id>/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
