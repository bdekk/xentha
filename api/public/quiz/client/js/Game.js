var QuizClient = QuizClient || {};

QuizClient.Game = function(){};

QuizClient.Game.prototype = {
  preload: function() {
    this.game.time.advancedTiming = true;
    this.categoryColors = [{"history": 0x62bd18, "science": 0xff5300, "entertainment": 0xd21034, "geography": 0xff475c, "technology": 0x8f16b2, "sports": 0x588c7e, "art": 0x8c4646}];
    this.bgColors = [0x62bd18, 0xff5300, 0xd21034, 0xff475c, 0x8f16b2, 0x588c7e, 0x8c4646];
    this.game.world.alpha = 1;

    this.TIME_PER_QUESTION = 20;
  },
  create: function() {
    this.backgroundSound = this.game.add.audio('background');
    this.backgroundSound.loopFull(0.4);
    this.buttonSound = this.game.add.audio('button');
    this.graphics = this.game.add.graphics(0, 0);

    var tintColor = this.bgColors[this.game.rnd.between(0, this.bgColors.length - 1)];
    this.game.stage.backgroundColor = tintColor;

    var style = {
      font: 'Luckiest Guy',
      fill: "#fff",
      fontSize: 40
    }

    this.xentha();
  },
  update: function() {
    //collision
    // var me = this;
    // for(var i = 0; i < this.players.length; i++) {
    //   var player = this.players[i];
    //   if(player) {
    //     var input = player.xentha.input[0];
    //     if(input) {
    //       if(input.id == 'up') {
    //         if(input.pressed == true) {
    //         } else {
    //         }
    //       }
    //       player.xentha.input.shift();
    //     }
    //   }
    // }
  },

  xentha: function() {
    var me = this;
    // XENTHA.on('game.input', function(data) {
    //     console.log(data);
    //     // if(data.input.pressed) {
    //     //   for(var i = 0; i < me.players.length; i++){
    //     //     if(me.players[i].xentha.id == data.player) {
    //     //       me.players[i].choice = data.input.id;
    //     //       break;
    //     //     }
    //     //   }
    //     // }
    // });

    XENTHA.on('game.start', function(data) {
            console.log('wildcard .. ');
    });

    XENTHA.on('player.joined', function(data) {
        console.log(data);
    });

    XENTHA.on('player.left', function(data) {
        console.log(data);
    });
    //
    // XENTHA.playerJoined = function(data) {
    // }
    //
    // XENTHA.playerLeft = function(data) {
    // }
  }
};
