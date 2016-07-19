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
    standalone: true,
    ui:{
      showNotifications:!0,
      showHowTo:!0,
      showPlayerList: true,
      sound:!0
    }
  },
  layouts: {
    CONTROLLER: 'controller'
  }
};


var init = function() {
  var canvas = document.getElementsByTagName('canvas')[0];
  var xNote = document.createElement('div');
  var text = document.createElement('p');
  xNote.setAttribute('id', 'xNotification');
  xNote.appendChild(text);
  document.body.insertBefore(xNote, document.body.firstChild);

  // to make sure that people can close this ;)
  xNote.addEventListener('click', function() {
   xNote.className = ' deactive';
  }, false);

  // add player list
  if(XENTHA.settings.ui.showPlayerList) {
    XENTHA.createPlayerList([]);
  }

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
  if(xNote) {
    xNote.getElementsByTagName("p")[0].innerHTML = message;
    xNote.className = 'active'
    setTimeout(function() {
      xNote.className = 'deactive';
    }, duration);
  }
}

XENTHA.createPlayerList = function(players) {
  var ul = document.createElement('ul');
  ul.setAttribute('id', 'playerList');
  var list = XENTHA.setPlayerItems(ul, players);
  document.body.insertBefore(list, document.body.firstChild);
}

XENTHA.setPlayerItems = function(parent, players) {
  for(var i =0; i < players.length; i++) {
    var li = document.createElement('li');
    var name = (players[i].host) ? players[i].name + '*' : players[i].name;
    li.innerHTML = name;
    li.style.color = players[i].color;
    parent.appendChild(li);
  }
  return parent;
}

XENTHA.setPlayerList = function(players) {
  var playerList = document.getElementById('playerList');
  // playerList.removeAll();
  while (playerList.firstChild) {
    playerList.removeChild(playerList.firstChild);
  }
  XENTHA.setPlayerItems(playerList, players);
}

// create / join room.
XENTHA.connect = function(url) {
  // XENTHA.socket =;
  XENTHA.socket = io.connect("http://" + XENTHA.settings.host+":"+XENTHA.settings.port);

  XENTHA.socket.on("gameError", function(data) {
    console.log(data.message);
  })

  XENTHA.socket.on('connect', function(data) {
    // XENTHA.showNotification('connected', 5000);
    XENTHA.vars.connected = 1;
    if(XENTHA.settings.standalone) {
      XENTHA.socket.emit('createRoom', {});
    } else if(XENTHA.vars.roomCode) {
      XENTHA.socket.emit('joinRoom', {type: 'game', roomCode: XENTHA.vars.roomCode});
    }
  })

  XENTHA.roomJoined = function(a) {};
  XENTHA.socket.on('roomJoined', function(data) {
      console.log(data);
      XENTHA.vars.connectedPlayers = data.players;
      XENTHA.vars.roomCode = data.roomCode;
      XENTHA.vars.state = data.state;
      XENTHA.showNotification('Go to xentha.com and enter code ' + data.roomCode, 50000);
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
    if(XENTHA.settings.standalone) {
      XENTHA.socket.emit('joinRoom', {type: 'game', roomCode: XENTHA.vars.roomCode});
    }
    XENTHA.roomCreated(data);
  });

    XENTHA.createRoomFailed = function(a) {};
  XENTHA.socket.on('createRoomFailed', function(data) {
    console.log('create room failed.');
    // XENTHA.socket.emit('createRoom');
    XENTHA.createRoomFailed(data);
  })

  XENTHA.stateChanged = function(a) {};
  XENTHA.socket.on('game.stateChanged', function(data) {
    XENTHA.vars.state = data.state;
    XENTHA.stateChanged(data);
  });

  XENTHA.playerJoined = function(a) {};
  XENTHA.socket.on('player.joined', function(data) {
    XENTHA.vars.connectedPlayers.push(data.player);
    if(XENTHA.settings.ui.showPlayerList) {
      XENTHA.setPlayerList(XENTHA.vars.connectedPlayers);
    }

    XENTHA.showNotification(data.player.name + ' joined the game.', 3000);
    XENTHA.playerJoined(data);
  });

  XENTHA.playerLeft = function(a) {};
  XENTHA.socket.on('player.left', function(data) {
    var index = XENTHA.vars.connectedPlayers.map(function(player) {return player.id; }).indexOf(data.player.id);
    XENTHA.vars.connectedPlayers.splice(index);
    XENTHA.showNotification(data.player.name + ' left the game.', 3000);
    XENTHA.playerLeft(data);
  });

  XENTHA.socket.on("player.orientation",function(a){
  });

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

// TODO: LOAD SOUND ASSETS!

window.XENTHA = XENTHA;
