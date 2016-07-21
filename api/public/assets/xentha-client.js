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
    roomCode:null,
    connectedPlayers: [],
    connected:0,
    state: 1,
    player: null,
    user: null
  },
  settings:{
    apiKey:"",
    version:"0",
    host: "192.168.140.111:3000",
    ws: "192.168.140.111:3000",
    api: "192.168.140.111:3000/api",
    ui:{
      showNotifications:true,
      sound:false
    }
  },
  layouts: {
    CONTROLLER: 'controller'
  }
};


// create / join room.
XENTHA.connect = function(url) {
  // XENTHA.socket =;
  XENTHA.socket = io.connect("http://" + XENTHA.settings.ws);
  XENTHA.callbacks = XENTHA.callbacks || [];

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
    // XENTHA.roomCreated(data);
  })

  XENTHA.roomCreated = function(a) {};
  XENTHA.socket.on('roomCreated', function(data) {
    console.log(data);

    XENTHA.vars.roomCode = data.roomCode;
    XENTHA.vars.connectedPlayers = data.players;
    XENTHA.vars.player = data.player;
    XENTHA.vars.state = data.state;

    XENTHA.roomCreated(data);
  });

  XENTHA.createRoom = function(data) {
    XENTHA.socket.emit('createRoom', data);
  }

  XENTHA.joinRoom = function(data) {
    data.user = data.user || XENTHA.vars.user;
    XENTHA.socket.emit('joinRoom', data);
  }

  XENTHA.buildLayout = function(a) {};
  XENTHA.socket.on('game.layout', function(data){
      XENTHA.buildLayout(data.layout);
  });

  XENTHA.addLayout = function(a) {};
  XENTHA.socket.on('game.layout.add', function(data) {
    XENTHA.addLayout(data.layout);
  })

  XENTHA.end = function(a) {};
  XENTHA.socket.on('game.end', function(data) {
    XENTHA.end(data);
  })

  XENTHA.error = function(a) {};
  XENTHA.socket.on('game.error', function(data){
      XENTHA.error(data);
  });
}

// normal events!
XENTHA.input = function(data) {
    XENTHA.socket.emit('player.input', data);
};

XENTHA.restart = function() {
  XENTHA.socket.emit('player.restart', {player: XENTHA.vars.player});
}

window.XENTHA = XENTHA;
