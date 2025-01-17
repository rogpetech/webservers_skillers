FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && \
  apt-get install -y sqlite3 libsqlite3-dev

COPY . /app

RUN pip install --no-cache-dir -r requiriments.txt

EXPOSE 5000

CMD [ "flask", "run", "--host=0.0.0.0" ]