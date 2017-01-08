FROM node:7.2.0

RUN useradd --user-group --create-home --shell /bin/false app &&\
  npm install --global npm@3.7.5

ENV HOME=/home/app

COPY package.json $HOME/api/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/api
RUN npm install

USER root
COPY . $HOME/api
RUN chown -R app:app $HOME/*
USER app

CMD ["node", "server.js"]
