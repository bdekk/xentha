FROM node:4.3.2

RUN useradd --user-group --create-home --shell /bin/false app &&\
  npm install --global npm@3.7.5 &&\
  npm install --global bower &&\
  npm install --global gulp

ENV HOME=/home/app

COPY package.json $HOME/client/
COPY bower.json $HOME/client/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/client
RUN npm install

USER root
COPY . $HOME/client
RUN chown -R app:app $HOME/*
USER app

EXPOSE 8000

CMD ["gulp", "watch"]
