FROM node:4.3.2

RUN useradd --user-group --create-home --shell /bin/false app &&\
  npm install --global npm@3.7.5 &&\
  npm install --global angular-cli

ENV HOME=/home/app

COPY package.json $HOME/site/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/site
RUN npm install

USER root
COPY . $HOME/site
RUN chown -R app:app $HOME/*
USER app

EXPOSE 4200

CMD ["ng", "serve"]
