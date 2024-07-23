from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from http import HTTPStatus

application = Flask(__name__)
application.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/users.sqlite3'
database = SQLAlchemy(application)

class User(database.Model):
  id = database.Column(database.Integer, primary_key=True)
  name = database.Column(database.String(80), nullable=False)
  email = database.Column(database.String(120), unique=True, nullable=False)

@application.route("/", methods=['GET'])
def root():
  return jsonify({ "message": "Welcome to webserver python skill.dev" })

@application.route("/ping", methods=['GET'])
def pong():
  return jsonify({ "message": "pong" })

@application.route("/users", methods=['GET'])
def gets_users():
  users = User.query.all()
  return jsonify(
    [
      {
        "id": user.id,
        "name": user.name,
        "email": user.email
      } for user in users ]
  )

@application.route("/users/<int:id>", methods=['GET'])
def get_user(id):
  user = User.query.get_or_404(id)
  return jsonify({
    "id": user.id,
    "name": user.name,
    "email": user.email
  })

@application.route("/users", methods=['POST'])
def create_user():
  data = request.get_json()
  new_user = User(name=data['name'], email=data['email'])
  database.session.add(new_user)
  database.session.commit()
  return jsonify({ "id": new_user.id,
                   "name": new_user.name,
                   "email": new_user.email}), HTTPStatus.CREATED

@application.route("/users/<int:id>", methods=['PUT'])
def update_user(id):
  data = request.get_json()
  user = User.query.get_or_404(id)
  user.name = data['name']
  user.email = data['email']
  database.session.commit()
  return jsonify({
    "id": user.id,
    "name": user.name,
    "email": user.email
  })

@application.route("/users/<int:id>", methods=['DELETE'])
def delete_user(id):
  user = User.query.get_or_404(id)
  database.session.delete(user)
  database.session.commit()
  return '', HTTPStatus.NO_CONTENT


with application.app_context():
  database.create_all()


if __name__ == '__main__':
  application.run(port=8000,debug=True)
