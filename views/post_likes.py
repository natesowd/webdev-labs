from flask import Response, request
from flask_restful import Resource
from models import LikePost, db
import json
from views import can_view_post

class PostLikesListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def post(self):
        # create a new "like_post" based on the data posted in the body 
        body = request.get_json()
        if not body.get('post_id'):
            return Response(json.dumps({"message": "Error: no post id found"}), mimetype="application/json", status=400)
        try:
            id = int(body.get('post_id'))
        except:
            return Response(json.dumps({"message":"Error: please enter a valid id number"}), mimetype="application/json", status=400)
        
        if not LikePost.query.get(id):
            return Response(json.dumps({"message":"Error: please enter a valid id number"}), mimetype="application/json", status=404)

        if not can_view_post(body.get('post_id'), self.current_user):
            return Response(json.dumps({"message": "Error: unauthorized viewer"}), mimetype="application/json", status=404)


    
        new_like = LikePost(
            self.current_user.id, # must be a valid user_id or will throw an error
            body.get('post_id')
        )
        try:
            db.session.add(new_like)    # issues the insert statement
            db.session.commit()
        except:
            return Response(json.dumps({"message": "Error: Duplicate Like"}), mimetype="application/json", status=400)

        return Response(json.dumps(new_like.to_dict()), mimetype="application/json", status=201)

class PostLikesDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        like = LikePost.query.get(id)
        if not like:
            return Response(json.dumps({"message":"Error: please enter a valid id number"}), mimetype="application/json", status=404)
        
        if like.user_id != self.current_user.id:
            return Response(json.dumps({"message":"Error: please enter a valid id number"}), mimetype="application/json", status=404)

        LikePost.query.filter_by(id=id).delete()
        db.session.commit() 
        return Response(json.dumps({"message": "Post id = {0} was successfully deleted".format(id)}), mimetype="application/json", status=200)




def initialize_routes(api):
    api.add_resource(
        PostLikesListEndpoint, 
        '/api/posts/likes', 
        '/api/posts/likes/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )

    api.add_resource(
        PostLikesDetailEndpoint, 
        '/api/posts/likes/<int:id>', 
        '/api/posts/likes/<int:id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
