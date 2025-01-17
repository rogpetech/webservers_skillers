FROM ruby:3.2
WORKDIR /app

RUN apt-get update && \
    apt-get install -y sqlite3 libsqlite3-dev && \
    gem install bundler

COPY . /app

RUN bundle install

EXPOSE 4567

CMD [ "ruby", "app.rb" ]
