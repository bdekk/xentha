# [Xentha](http://www.xentha.com)

Xentha is a local gaming API for HTML5 games.

## Functionality

#### Client library: 

1. receive server commands: roomJoined, playerLeft, playerJoined 
2. send input to server (e.g. button clicks)
3. Basic controller layout
4. Join room & Login screens
  
#### Server library (to add to your game): 

1. Receive player input 
2. Define client layout and send to clients (buttons, text) 
3. createRoom, joinRoom, playerJoined, playerLeft 
4. Basic sounds and play functionality (using AudioContext)

#### Website
1. Frontpage
2. Games list

## TODO
#### Client
- Custom button definitions
- Custom achievements per game (perhaps add them through website)

#### Website
- Lobby
- Profile
- Leaderboard / Scoreboard

## PROGRESS
[Trello Board](https://trello.com/b/8gTCaTkN/xentha)

## Installation
The project has been divided into three parts.
- the API which handles the websocket and api calls.
- the client which makes a connection to the api using websockets (socket.io)
- the website. 

### Requirements
npm

#### api
npm install
node / nodemon server.js

#### client
npm install
bower install
gulp watch

#### site
npm install
bower install
gulp watch
