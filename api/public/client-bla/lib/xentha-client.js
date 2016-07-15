// client xentha library. Use this to create your xentha game :)

var XENTHA = {
  GAMESTATES: {
    LOBBY: 0,
    GAME: 1,
    HIGHSCORE: 2,
    PAUSE: 3,
    NOT_CONNECTED: 4
  },
  socket: null,
  vars: {
    roomCode:"",
    connectedPlayers: [],
    connected:0,
    state: 1,
    player: null
  },
  settings:{
    apiKey:"",
    version:"0",
    host: "127.0.0.1",
    port:"3000",
    ui:{
      showNotifications:!0,
      sound:!0
    }
  }
};

// create / join room.
XENTHA.connect = function(url) {
  // XENTHA.socket =;
  XENTHA.socket = io.connect("http://" + XENTHA.settings.host+":"+XENTHA.settings.port);

  // XENTHA.socket.on("*",function(event,data) {
  //   console.log(event);
  //   console.log(data);
  //   XENTHA.on(event, data);
  // });

  XENTHA.error = function(a) {};
  // XENTHA.socket.on('connect_failed', function(data){
  //     XENTHA.error(data);
  // });

  XENTHA.socket.on('connect', function(data) {
    XENTHA.vars.connected = 1;
  })

  XENTHA.roomJoined = function(a) {};
  XENTHA.socket.on('roomJoined', function(data) {
    console.log(data);
    XENTHA.vars.roomCode = data.roomCode;
    XENTHA.vars.connectedPlayers = data.players;
    XENTHA.vars.player = data.player;
    XENTHA.vars.state = data.state;
    XENTHA.roomJoined(data);
  });

  XENTHA.socket.on('stateChanged', function(data) {
    // if(data.state == XENTHA.GAMESTATES.GAME) {
    //   addActions();
    // }
    XENTHA.roomCreated(data);
  })

  XENTHA.roomCreated = function(a) {};
  XENTHA.socket.on('roomCreated', function(data) {
    console.log(data);
    XENTHA.roomCreated(data);
  });

  // XENTHA.on = function(type, func) {
  //     return XENTHA.socket.on(type, func);
  // };
}

// XENTHA.on = function(type, data) {};

// XENTHA.emit = function(type, data) {
//     XENTHA.socket.emit(type, data);
// };

// normal events!
XENTHA.buttonClick = function(event) {
    XENTHA.socket.emit('player.buttonClick');
};

XENTHA.arrowUp = function(event) {
    XENTHA.socket.emit('player.arrowUp', {player: XENTHA.vars.player});
};

XENTHA.arrowDown = function(event) {
    XENTHA.socket.emit('player.arrowDown', {player: XENTHA.vars.player});
};

XENTHA.arrowLeft = function(event) {
    XENTHA.socket.emit('player.arrowLeft', {player: XENTHA.vars.player});
};

XENTHA.arrowRight = function(event) {
    XENTHA.socket.emit('player.arrowRight', {player: XENTHA.vars.player});
};

window.XENTHA = XENTHA;
