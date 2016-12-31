//TODO CHECK AND REMOVE UNNECESSARY CODE.

// server xentha library. Use this to create your xentha game :)
var pathArray = window.location.pathname.split( 'room' );

/** Emitter to receive events **/
function Emitter(obj) {
  if (obj) return mixin(obj);
};

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }
  return this;
};

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

/** GAME LIBRARY **/

var XENTHA = {
  socket: null,
  callbacks: {
      "room.joined": 'roomJoined',
      "room.joined.error": 'roomJoinedFailed',
      "room.created": 'roomCreated',
      "player.joined": 'playerJoined',
      "player.left": 'playerLeft'
  },
  ws: "ws://localhost:3000",
  api: "http://localhost:3000",
  apiKey: "",
  connected: false,
  room: {},
  vars: {
    autoJoin: true,
    autoCreate: true,
    roomCode: getParameterByName('room'),
    showNotifications:true,
    showPlayerList: true
  },
  // vars: {
  //   connectedPlayers:[],
  //   roomCode: getParameterByName('room'),
  //   connected:false
    // sounds: {},
    // soundFiles: [{
    //   name: "achievement",
    //   url: "http://localhost:3000/assets/sounds/achievement.mp3",
    //   loop: false,
    //   autoPlay: false,
    //   play: function() {},
    //   stop: function() {}
    // },{
    //   name: "success",
    //   url: "http://localhost:3000/assets/sounds/success.wav",
    //   loop: false,
    //   autoPlay: false,
    //   play: function() {},
    //   stop: function() {}
    // }]
  // },
  // settings:{
    // apiKey:"", //key to identify game socket.
    // version:"0",
    // host: "http://localhost:3000",
    // ws: "ws://localhost:3000",
    // api: "http://localhost:3000/api",
    // standalone: true,

    // sound:true
  // }
};


var init = function() {
  // var canvas = document.getElementsByTagName('canvas')[0];
  if(XENTHA.vars.showNotifications) {
    XENTHA.createNotification();
  }

  XENTHA.createInfo();

  // if the sound is off, the user should still be able to access his/her sounds.
  // XENTHA.loadSoundResources(XENTHA.vars.sounds);

  // add player list
  if(XENTHA.vars.showPlayerList) {
    XENTHA.createPlayerList([]);
  }

  addCss(XENTHA.api + "/assets/xentha-server.css");
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

// SOUNDS FOR ACHIEVEMENTS.
// XENTHA.loadSoundResources = function(sounds) {
//   window.AudioContext = window.AudioContext || window.webkitAudioContext;
//   if(!window.AudioContext) return;
//   var context = new AudioContext();
//
//   // source: http://www.html5rocks.com/en/tutorials/webaudio/intro/
//   // https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode
//   XENTHA.vars.soundFiles.forEach(function(soundFile, index) {
//     var request = new XMLHttpRequest();
//     request.open('GET', soundFile.url, true);
//     request.responseType = 'arraybuffer';
//
//     var sound = {};
//     sound.play = function() {};
//
//     // Decode asynchronously
//     request.onload = function() {
//       context.decodeAudioData(request.response, function(buffer) {
//         sound.play = function () {
//           if(XENTHA.settings.sound) {
//             var source = context.createBufferSource();
//             source.buffer = buffer;
//             source.connect(context.destination);
//             if (!source.start)
//                 source.start = source.noteOn;
//             source.start(0);
//             source.loop = soundFile.loop;
//             source.autoPlay = soundFile.autoPlay;
//           }
//         };
//         XENTHA.vars.sounds[soundFile.name] = sound;
//       });
//     }
//     request.send();
//   });
// }

XENTHA.createPlayerList = function(players) {
  var ul = document.createElement('ul');
  ul.setAttribute('id', 'playerList');
  var list = XENTHA.setPlayerItems(ul, players);
  document.body.insertBefore(list, document.body.firstChild);
}

XENTHA.createNotification = function() {
  var xNote = document.createElement('div');
  var text = document.createElement('p');
  xNote.setAttribute('id', 'xNotification');
  xNote.appendChild(text);
  document.body.insertBefore(xNote, document.body.firstChild);

  // to make sure that people can close this ;)
  xNote.addEventListener('click', function() {
   xNote.className = ' deactive';
  }, false);
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

XENTHA.createInfo = function() {
  var xInfo = document.createElement('div');
  var text = document.createElement('p');
  xInfo.setAttribute('id', 'xInfo');
  xInfo.appendChild(text);
  document.body.insertBefore(xInfo, document.body.firstChild);
}

XENTHA.setInfoText = function(text) {
  var xInfo = document.getElementById('xInfo');
  xInfo.getElementsByTagName("p")[0].innerHTML = text;
}

XENTHA.showRoomCode = function(visible) {
  var info = document.getElementById('xInfo');
  if(info) {
    info.style.visibility = (visible) ? 'visible' : 'hidden';
  }
}

XENTHA.send = function(id, data) {
  if(!XENTHA.connected) {
    console.error('Socket is not connected.');
    return;
  }

  XENTHA.socket.send(JSON.stringify({"id": id, "data": data}));
}

Emitter(XENTHA);

XENTHA.connect = function(url, opts) {
  var url = url || this.ws;
  var opts = opts || {autoJoin: true};

  if(!(XENTHA.apiKey && XENTHA.apiKey.length > 1)) {
    console.err('please enter an API key (xentha.apikey)');
    return;
  }

  XENTHA.socket = new WebSocket(url);

  XENTHA.socket.onopen = function(event) {
        XENTHA.connected = true;
        if(XENTHA.vars.roomCode) {
          XENTHA.send("room.join", {'roomCode': XENTHA.vars.roomCode, 'type': 'screen'});
        } else if(XENTHA.vars.autoCreate) {
          XENTHA.send("room.create", {"name": "Standalone room."});

          // act on room created callback.
          XENTHA.on('_room.created', function(data) {
            XENTHA.send("room.join", {'roomCode': data.roomCode, 'type': 'screen'});
            XENTHA.on("_screen.joined", function(data) {
                XENTHA.roomCode = data.roomCode;
                XENTHA.send('game.init', {"apiKey": XENTHA.apiKey});
                XENTHA.setInfoText('Go to xentha.com and enter code <strong>' + data.roomCode + '</strong>');
            });
            XENTHA.on("_screen.joined.error", function(data) {
                XENTHA.setInfoText('Room joined failed. </strong>', 5000);
            });
          });
        }
  };

  /** if a message is received on this socket, call the related method **/
  XENTHA.socket.onmessage = function (event) {
    var data = JSON.parse(event.data);
    if(data.id == 'message') return; // called upon send?
    if(!data.id || !data.data) {
      XENTHA.emit('error', 'message does not have an id or data.');
      return;
    }

    XENTHA.emit('_' + data.id, data.data);
    XENTHA.emit(XENTHA.callbacks[data.id], data.data);
  };

  XENTHA.socket.onerror = function(data) {
    XENTHA.emit('error', 'error while connecting..');
  };

  XENTHA.socket.onclosed = function(event) {
    XENTHA.emit('error', 'client closed.');
  };

  XENTHA.on('_game.stateChanged', function(data) {
    XENTHA.vars.state = data.state;
  }.bind(this));

  XENTHA.on('_player.joined', function(data) {
    data.player.input = []; //create an empty input array.
    XENTHA.room.players.push(data.player);
    if(XENTHA.settings.ui.showPlayerList) {
      XENTHA.setPlayerList(XENTHA.room.players);
    }
    XENTHA.showNotification(data.player.name + ' joined the game.', 3000);
  }.bind(this));

  XENTHA.playerLeft = function(a) {};
  XENTHA.on('_player.left', function(data) {
    var index = XENTHA.room.players.map(function(player) {return player.id; }).indexOf(data.player.id);
    XENTHA.room.players.splice(index);
    if(XENTHA.vars.showPlayerList) {
      XENTHA.setPlayerList(XENTHA.room.players);
    }
    XENTHA.showNotification(data.player.name + ' left the game.', 3000);
    XENTHA.playerLeft(data);
  }.bind(this));

  XENTHA.on("_player.orientation",function(a){
  }.bind(this));
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

window.XENTHA = XENTHA;
