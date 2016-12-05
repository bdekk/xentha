# [Xentha](http://www.xentha.com)

Xentha is a local gaming API for HTML5 games.

## Libraries for your games

#### Client library (to add to your client.html): 

1. receive game events: roomJoined, roomLeft, gameStart
2. Send input to server (e.g. button clicks, player positions.
  
#### Game library (to add to your index.html): 

1. Send game events (state changes, game logic)
2. Receive general events: playerJoined, playerLeft 
3. Receive player input

## Provided

#### Website
1. Frontpage
2. Games list
3. Roomcode to join
4. Start game from room.

#### Controller
1. Numpad to join a room
2. Controller layout to control the the website's menu and pages
3. Menu to change player name and color, leave/quit the game


## TODO
#### Client
- Player info update (name, color)
- Leave game and quit game

#### Screen
- Keep track of state changes and end game
- Session management upon closing the game / players leaving

#### Website
- Leaderboard / Scoreboard per room
- Achievements

## PROGRESS
[Trello Board](https://trello.com/b/8gTCaTkN/xentha)

## Installation
The project has been divided into three parts.
- the API which handles the websocket and api calls.
- the controller which makes a connection to the api using websockets and contains a basic menu, controller-pad and functionality to show the client-side of the games that are being played. The client uses sockets to send communication from the client to the server.
- the website which acts as a screen and roomhost to play your games on. The website uses sockets to create rooms and send  player communication to the games. 

### Requirements
npm

#### api (nodejs, express)
npm install
node / nodemon server.js

#### client (jquery and html,css)
npm install
bower install
gulp watch

#### site (angular2 angular-cli)
npm install
bower install
ng serve
