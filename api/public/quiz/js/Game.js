var Quiz = Quiz || {};

Quiz.Game = function(){};

Quiz.Game.prototype = {

  preload: function() {
      this.game.time.advancedTiming = true;
      this.bgColors = [{"history": 0x62bd18, "science": 0xff5300, "entertainment": 0xd21034, "geography": 0xff475c, "technology": 0x8f16b2, "sports": 0x588c7e, "art": 0x8c4646}];
    },
  create: function() {
    this.coinSound = this.game.add.audio('coin');
    this.backgroundSound = this.game.add.audio('background');
    this.backgroundSound.loopFull(0.4);

    var tintColor = "0xff5300";
    this.game.stage.backgroundColor = tintColor;

    this.players = [];
    this.initXentha();
  },
  update: function() {
    //collision
    var me = this;
    for(var i = 0; i < this.players.length; i++) {
      var player = this.players[i];
      if(player) {
        var input = player.xentha.input[0];
        if(input) {
          if(input.id == 'up') {
            if(input.pressed == true) {
            } else {
            }
          }
          player.xentha.input.shift();
        }
      }
    }
  },
  getOtherPlayers: function(player) {
    var otherPlayers = [];
    for(var i =0; i < this.players.length; i++) {
      if(this.players[i].xentha.id !== player.xentha.id) {
        otherPlayers.push(this.players[i]);
      }
    }
    return otherPlayers;
  },
  initXentha: function() {
    if(!XENTHA) {
      console.err('could not find xentha :(');
      return;
    }

    XENTHA.settings.apiKey = "RYejWPlWd1xq";
    XENTHA.connect();

    var me = this;

    XENTHA.playerJoined = function(data) {
      XENTHA.setLayout(XENTHA.layouts.CONTROLLER);
      // data.players.forEach(function(xPlayer, index) {
      var player = me.game.add.sprite(100, 200, 'player');
      player.gun = me.game.add.sprite(0, 0, 'gun');
      player.addChild(player.gun);
      player.gun.anchor.setTo(-.5, -.3);

      me.game.physics.arcade.enable(player);
      player.body.collideWorldBounds=true;
      player.body.gravity.y = 1000;

      // set default lives.
      player.lives = this.lives;
      player.xentha = data.player;
      me.players.push(player);
    }

    XENTHA.playerLeft = function(data) {
      console.log('player left.. ');
      var index = me.players.map(function(player) {return player.xentha.id; }).indexOf(data.player.id);
      me.players[index].destroy();
      me.players.splice(index);
    }

    XENTHA.onInput = function(data) {
      for(var i = 0; i < me.players.length; i++){
        if(me.players[i].xentha.id == data.player) {
          me.players[i].xentha.input.push({id: data.input.id, pressed: data.input.pressed});
        }
      }
    }
  },
  checkIfEndGame: function() {
  },
  endGame: function() {
    this.game.state.start('Game');
  },
  render: function() {

  }
};
