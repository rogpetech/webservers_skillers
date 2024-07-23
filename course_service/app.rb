require 'sinatra'
require 'sinatra/activerecord'
require 'rest-client'
require 'json'
require 'pry'
require 'pry-nav'
require 'logger'

set :database, { adapter: "sqlite3", database: "db/development.sqlite3" }

# Models
class Course < ActiveRecord::Base
  has_many :lessons
end

class Lesson < ActiveRecord::Base
  belongs_to :course
  has_many :attendances

  validates :title, presence: true
end

class Attendance < ActiveRecord::Base
  belongs_to :course
end

def user_exists?(user_id)
  response = RestClient.get("http://localhost:8000/users/#{user_id}", { content_type: :json })
  response.code == 200
rescue RestClient::NotFound
  false
rescue RestClient::ExceptionWithResponse => err
  false
end

# routes
get '/courses' do
  Course.all.to_json
end

get '/courses/:id' do
  course = Course.find(params[:id])

  course.to_json
end

post '/courses' do
  data = JSON.parse(request.body.read)
  course = Course.new(data["course"])

  if course.save
    status 201
    course.to_json
  else
    status 422
    course.errors.to_json
  end
end

put '/courses/:id' do
  course = Course.find(params[:id])
  
  if course.update(params[:course])
    course.to_json
  else
    status 422
    course.errors.to_json
  end
end

delete '/courses/:id' do
  course = Course.find(params[:id])
  course.destroy
  status 204
end

post '/lessons' do
  data = JSON.parse(request.body.read)
  lesson = Lesson.new(data["lesson"])
  if lesson.save
    status 201
    lesson.to_json
  else
    status 422
    lesson.errors.to_json
  end
  
end

get '/lessons' do
  lessons = Lesson.all
  lessons.to_json
end

get '/lessons/:id' do
  lesson = Lesson.find(params[:id])

  lesson.to_json
rescue ActiveRecord::RecordNotFound => error
  status 404
  { error: error.message }.to_json
end

put '/lessons/:id' do
  lesson = Lesson.find(params[:id])

  data = JSON.parse(request.body.read)
  
  if lesson.update(data["lesson"])
    lesson.to_json
  else
    status 422
    lesson.errors.to_json
  end
rescue ActiveRecord::RecordNotFound => error
  status 404
  error.message.to_json
end

delete '/lessons/:id' do
  lesson = Lesson.find(params[:id])
  lesson.destroy
  status 204
end

get '/attendances' do
  Attendance.all.to_json
end

post "/attendances" do
  data = JSON.parse(request.body.read)
  payload = data["attendance"]
  attendance = Attendance.new(payload)
  
  unless user_exists?(payload["user_id"])
    status 422
    return { message: 'Error check user_id' }.to_json
  end

  if attendance.save
    status 201
    attendance.to_json
  else
    status 422
    attendance.errors.to_json
  end
end

put "/attendances/:id" do
  attendance = Attendance.find(params[:id])
  data = JSON.parse(request.body.read)
  
  if attendance.update(data["attendance"])
    attendance.to_json
  else
    status 422
    attendance.errors.to_json
  end
end

get "/attendances/:id" do
  attendance = Attendance.find(params[:id])
  attendance.to_json
end

delete "/attendanes/:id" do
  Attendance.find(params[:id]).destroy
end
