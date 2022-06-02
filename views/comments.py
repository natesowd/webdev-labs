from flask import Response, request
from flask_restful import Resource
import json
from models import db, Comment, Post

class CommentListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def post(self):
        body = request.get_json()
        try:
            id = int(body.get('post_id'))
        except:
            return Response(json.dumps({"message":"Error: please enter a valid id number"}), mimetype="application/json", status=400)
        
        if not body.get('post_id'):
            return Response(json.dumps({"message": "Error: no post id found"}), mimetype="application/json", status=400)
        
        posts = Post.query.get(id)
        # try:
        #     if posts.user_id != self.current_user.id:
        #         return Response(json.dumps({"message": "Error: invalid id"}), mimetype="application/json", status=404)
        # except:
        #     return Response(json.dumps({"message": "Error: invalid id"}), mimetype="application/json", status=404)

        if not body.get('text'):
            return Response(json.dumps({"message": "Error: no text for comment found"}), mimetype="application/json", status = 400)
        
        new_comment = Comment(
            user_id = self.current_user.id, # must be a valid user_id or will throw an error
            text = body.get('text'),
            post_id=body.get('post_id')
        )
        db.session.add(new_comment)    # issues the insert statement
        db.session.commit()     
        return Response(json.dumps(new_comment.to_dict()), mimetype="application/json", status=201)
        
class CommentDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
  
    def delete(self, id):
        comment = Comment.query.get(id)
        if not comment:
            return Response(json.dumps({"message":"Error: please enter a valid id number"}), mimetype="application/json", status=404)
        
        if comment.user_id != self.current_user.id:
            return Response(json.dumps({"message":"Error: please enter a valid id number"}), mimetype="application/json", status=404)

        Comment.query.filter_by(id=id).delete()
        db.session.commit() 
        return Response(json.dumps({"message": "Comment id = {0} was successfully deleted".format(id)}), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        CommentListEndpoint, 
        '/api/comments', 
        '/api/comments/',
        resource_class_kwargs={'current_user': api.app.current_user}

    )
    api.add_resource(
        CommentDetailEndpoint, 
        '/api/comments/<int:id>', 
        '/api/comments/<int:id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
