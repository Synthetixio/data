FROM nikolaik/python-nodejs:python3.11-nodejs16-slim

WORKDIR /app

COPY package*.json ./
COPY requirements.txt .
COPY patches/ ./patches/

RUN apt-get update && apt-get install -y supervisor
RUN apt-get install -y build-essential && npm ci && apt-get remove -y build-essential

COPY . .

RUN chmod +x entrypoint.sh

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt


ENTRYPOINT ["./entrypoint.sh"]
