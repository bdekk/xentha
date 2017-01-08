FROM node:4.3.2

RUN useradd --user-group --create-home --shell /bin/false app &&\
  npm install --global npm@3.7.5 &&\
  npm install --global bower &&\
  npm install --global polymer-cli

ENV HOME=/home/app

COPY package.json bower.json $HOME/devsite/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/devsite
RUN npm install
RUN bower install

USER root
COPY . $HOME/devsite
RUN chown -R app:app $HOME/*
USER app

EXPOSE 8080

CMD ["polymer", "serve"]
