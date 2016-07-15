// var buttonClick = function(event) {
//
// }

var global = {
  WIDTH: 1136,
  HEIGHT: 640,
  DEBUG: true,
  network: {
      socket: undefined,
      host: "localhost",
      port: 8080,
      totlatency: 0,
      latency: 0,
      emitTime: 0,
      emits: 0,
      room: ""
  },
  state: {
      playername: "",
      roomCode: [],
      status: "No"
  }
}

/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0
    },


    // Run on page load.
    onload: function () {
        // Initialize the video.
        if (!me.video.init(960, 640, {wrapper : "screen", scale : "auto"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        if (me.game.HASH.debug === true) {
            window.onReady(function () {
                me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
            });
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        me.loader.onload = this.loaded.bind(this);
        this.loadResources();
    },

    loadResources: function () {
       var resources = [];

       // Graphics.
       this.resources["img"].forEach(function forEach(value) {
           resources.push({
               name: value,
               type: "image",
               src : "assets/img/" + value + ".png"
           })
       });

       // Atlases.
      //  this.resources["tps"].forEach(function forEach(value) {
      //      resources.push({
      //          name  : value,
      //          type  : "tps",
      //          src   : "assets/img/" + value + ".json"
      //      })
      //  });

       // Maps.
       this.resources["map"].forEach(function forEach(value) {
           resources.push({
                name  : value,
                type  : "tmx",
                src   : "assets/maps/" + value + ".json"
           })
       });

       // Load the resources.
       me.loader.preload(resources);
   },

    // Run on game resources loaded.
    loaded : function () {
        me.state.set(me.state.START, new game.StartScreen());
        me.state.set(me.state.LOBBY, new game.LobbyScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // Load texture.
        game.texture = new me.TextureAtlas(
            // me.loader.getAtlas("texture"),
            me.loader.getImage("texture")
        );

        me.game.sort(game.sort);

        // Start the game.
        me.state.change(me.state.START);
    }
};

// XENTHA.connect();

var createRoom = function() {
  var roomName = document.getElementById('roomName').value;
  var name = document.getElementById('name').value;
  if(roomName && name) {
    XENTHA.socket.emit('createRoom', {name: 'Brams Room', });
  } else {
      document.getElementById('error').textContent = 'Please enter roomName and name.';
  }
}

var joinRoom = function() {
  var name = document.getElementById('name').value;
  var roomCode = document.getElementById('roomCode').value;
  if(name && roomCode) {
    XENTHA.socket.emit('joinRoom', {roomCode: roomCode, name: name});
  } else {
      document.getElementById('error').textContent = 'Please enter name and roomCode.';
  }
}

XENTHA.roomCreated = function(data) {
    var name = document.getElementById('name').value;
    if(name) {
      XENTHA.socket.emit('joinRoom', {roomCode: data.roomCode, name: name});
    }
}

XENTHA.roomJoined = function(data) {
    // present lobby or gamepad.


};

XENTHA.error = function(data) {
    document.getElementById('error').textContent = data;
}
