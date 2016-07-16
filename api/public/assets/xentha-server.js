// server xentha library. Use this to create your xentha game :)
var pathArray = window.location.pathname.split( 'room' );

var XENTHA = {
  socket: null,
  vars: {
    state: 0,
    connectedPlayers:[],
    roomCode: getParameterByName('room'),
    connected:0,
    callbacks: [],
    sounds:{
      achievementUnlocked: "aunlocked.wav"
    },
  },
  settings:{
    apiKey:"", //key to identify game socket.
    version:"0",
    host: "localhost",
    port:"3000",
    ui:{
      showNotifications:!0,
      showHowTo:!0,
      sound:!0
    }
  },
  layouts: {
    CONTROLLER: 'controller'
  }
};


var init = function() {
  // document.body.innerHTML += '<div id="xNotification" class=""><p></p></div>';
  //
  // // to make sure that people can close this ;)
  // var xNote = document.getElementById("xNotification");
  // xNote.addEventListener('click', function() {
  //  xNote.className = ' deactive';
  // }, false);

  addCss('http://' + XENTHA.settings.host + ":" + XENTHA.settings.port + "/assets/xentha-server.css");
}

function addCss(fileName) {

  var head = document.head
    , link = document.createElement('link')

  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = fileName
  head.appendChild(link)
}

window.onload = function() {
  init();
}


XENTHA.showNotification = function(message, duration) {
  var xNote = document.getElementById("xNotification");
  // if(color) { xNote.style.background = color; };
  if(xNote) {
    xNote.getElementsByTagName("p")[0].innerHTML = message;
    xNote.className = 'active'
    setTimeout(function(){ xNote.className = 'deactive'; }, duration);
  }
}

// create / join room.
XENTHA.connect = function(url) {
  // XENTHA.socket =;
  XENTHA.socket = io.connect("http://" + XENTHA.settings.host+":"+XENTHA.settings.port);

  // XENTHA.socket.on("*",function(event,data) {
  //   console.log(event);
  //   console.log(data);
  //   XENTHA.on(event, data);
  // });

  XENTHA.socket.on("gameError", function(data) {
    console.log(data.message);
  })

  XENTHA.socket.on('connect', function(data) {
    XENTHA.showNotification('connected', 5000);
    XENTHA.vars.connected = 1;
    if(XENTHA.vars.roomCode) {
      XENTHA.socket.emit('joinRoom', {type: 'game', roomCode: XENTHA.vars.roomCode});
    }
  })

  XENTHA.roomJoined = function(a) {};
  XENTHA.socket.on('roomJoined', function(data) {
      console.log(data);
      XENTHA.vars.connectedPlayers = data.players;
      XENTHA.vars.roomCode = data.roomCode;
      XENTHA.vars.state = data.state;
      XENTHA.roomJoined(data);
  });

  XENTHA.joinRoomFailed = function(a) {};
  XENTHA.socket.on('joinRoomFailed', function(data) {
    console.log('join room failed.');
    // XENTHA.socket.emit('createRoom');
    XENTHA.joinRoomFailed(data);
  })

  XENTHA.roomCreated = function(a) {};
  XENTHA.socket.on('roomCreated', function(data) {
    XENTHA.vars.connectedPlayers = data.players;
    XENTHA.vars.roomCode = data.roomCode;
    XENTHA.vars.state = data.state;
    XENTHA.roomCreated(data);
  });

    XENTHA.createRoomFailed = function(a) {};
  XENTHA.socket.on('createRoomFailed', function(data) {
    console.log('create room failed.');
    // XENTHA.socket.emit('createRoom');
    XENTHA.createRoomFailed(data);
  })

  // XENTHA.socket.on('roomCreated', function(data) {
  //   XENTHA.vars.roomCode = data.roomCode;
  // })

  XENTHA.stateChanged = function(a) {};
  XENTHA.socket.on('game.stateChanged', function(data) {
    XENTHA.vars.state = data.state;
    XENTHA.stateChanged(data);
  });

  XENTHA.playerJoined = function(a) {};
  XENTHA.socket.on('player.joined', function(data) {
    XENTHA.vars.connectedPlayers.push(data.player);
    XENTHA.playerJoined(data);
  });

  XENTHA.playerLeft = function(a) {};
  XENTHA.socket.on('player.left', function(data) {
    var index = XENTHA.vars.connectedPlayers.map(function(player) {return player.id; }).indexOf(data.player.id);
    XENTHA.vars.connectedPlayers.splice(index);
    XENTHA.playerLeft(data);
  });

  XENTHA.socket.on("player.orientation",function(a){
  });
  // XENTHA.socket.on("playerClick",function(a){});

  //
  // XENTHA.playerMoveLeft = function(a) {};
  // XENTHA.socket.on("playerMoveLeft",function(a){
  //   console.log(a);
  //   XENTHA.playerMoveLeft(a);
  // });
  //
  //
  // XENTHA.socket.on("playerMoveRight",function(a){
  //   XENTHA.playerMoveRight(a);
  // });
  // XENTHA.socket.on("playerMoveUp",function(a){
  //   XENTHA.playerMoveUp(a);
  // });
  // XENTHA.socket.on("playerMoveDown",function(a){
  //   XENTHA.playerMoveDown(a);
  // });

  // CONVENIENCE METHOD.

  // {data: , player (optional): , event: .. }
  XENTHA.send = function(obj) {
    if(!obj.event || !obj.data) return;
    XENTHA.socket.emit('game.send', obj);
  }

    // NOT USED YET.
  XENTHA.die = function(data) {
      // XENTHA.socket.emit('game.die', {id: data.id});
      XENTHA.send({event: 'game.die', player: data.id, data: {die: true}});
  }

// {id: data.id, score: data.score}
  XENTHA.score = function(data) {
      // XENTHA.socket.emit('game.score', data);
      XENTHA.send({event: 'game.score', player: data.id, data: {score: data.score}});
  }

  // NOT USED YET.
// {players: data.players, time: data.time}
  XENTHA.end = function(data) {
      // XENTHA.socket.emit('game.end', data);
      XENTHA.send({event: 'game.end', data: {players: data.players, time: data.time}});
  }

    // NOT USED YET.
  XENTHA.start = function(data) {
    XENTHA.socket.emit('game.start', {players: data.players});
  }

    // NOT USED YET.
  XENTHA.onPlayerRestart = function(data) {};
  XENTHA.socket.on('player.restart', function(data) {
    XENTHA.onPlayerRestart(data);
  });

  // set player layout (type: button, input, id: .. position: x, y, width, height)
  XENTHA.setLayout = function(data) {
    XENTHA.socket.emit('game.layout', data);
  }

  XENTHA.addLayout = function(data) {
    XENTHA.send(data);
  }


  // type: button, input, id: .. leftArrow, pressed: true/false)
  XENTHA.onInput = function(data) {}
  XENTHA.socket.on('player.input', function(data) {
      XENTHA.onInput(data);
  });

//GAME DOES NOT NEED TO CREATE ROOMS. He just joins a room with the right state.
  // XENTHA.createRoom() {
  //   XENTHA.socket.emit('createRoom');
  // };
  //
  XENTHA.joinRoom = function() {
    XENTHA.socket.emit('joinRoom', {type: 'game', roomCode: XENTHA.vars.roomCode});
  }

  XENTHA.createRoom = function(name) {
    XENTHA.socket.emit('createRoom', {type: 'game', roomName: name});
  }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// XENTHA.on("connect",function(a){
//   var callbacks = [
//     "player.join": playerJoined,
//     "player.leave": playerLeft,
//     "player.click": playerClick,
//     "player.up": playerUp,
//     "player.down": playerDown,
//     "player.left": playerLeft,
//     "player.right": playerRight,
//     "player.orientation": playerOrientation,
//
//     "game.achievementUnlocked": achievementUnlocked
//   ];
//
//   XENTHA.callbacks.concat(callbacks);
//
//   XENTHA.emit("init", {"apiKey": XENTHA.settings.apiKey}); //initialize game socket. Connect to api.
// }),
//
// XENTHA.on("error", function(data) {
//     // could not connect to api?
//     XENTHA.showNotification(data.error, 2000);
// });
//
// XENTHA.on("playerLeft",function(a){}),
// XENTHA.on("_playerLeft",function(a){
//   var b = a.id;null != a.name && (b=a.name),
//   XENTHA.vars.connectedPlayers.splice(XENTHA.vars.connectedPlayers.indexOf(a.id),1),
//   XENTHA.showHideHowToPopup()
// });
//
// XENTHA.on("achievementUnlocked",function(a){}),
// XENTHA.on("_achievementUnlocked",function(a){
//   XENTHA.vars.sounds.achievement.play(),
//   XENTHA.showNotification('<img src="'+a.image+'" /> Achievement unlocked: <strong>'+a.name+"</strong>",5e3)
// });
//
// XENTHA.on("playerJoined",function(a){});
// XENTHA.on("_playerJoined",function(a){
//   var b=a.id;null!=a.name&&(b=a.name),
//   XENTHA.showNotification('Player "'+b+'" joined.'),
//   XENTHA.vars.connectedPlayers.push(a.id),
//   XENTHA.showHideHowToPopup()
// });
//
// XENTHA.socket.on("playerOrientation",function(a){});
// XENTHA.socket.on("playerClick",function(a){});
// XENTHA.socket.on("playerLeft",function(a){});
// XENTHA.socket.on("playerRight",function(a){});
// XENTHA.socket.on("playerUp",function(a){});
// XENTHA.socket.on("playerDown",function(a){});
//
// XENTHA.showNotification = function(text,duration){
//   if(XENTHA.settings.ui.showNotifications) {
//     var c=Date.now(),
//     d=document.createElement("div");
//     console.log(text, ' .. ', duration);
//   }
// };
//
// XENTHA.showHowTo = function(a,b) {
//
// }

// TODO: LOAD SOUND ASSETS!

window.XENTHA = XENTHA;
