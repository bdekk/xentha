var Bussen = Bussen || {};

Bussen.Game = function(){};

Bussen.Game.prototype = {
  preload: function() {
    this.game.world.alpha = 1;
    // this.backgroundSound = this.game.add.audio('background');
    // this.backgroundSound.loopFull(0.4);
    this.game.players = [{"name": "Bram"}, {"name": "Jarno"}, {"name": "Rutger"}, {"name": "Chiel"}];

    this.playerGroups = [];

    for(var i = 0; i < this.game.players.length; i++) {
        this.playerGroups.push(this.game.add.group());
    }

    this.round = 0;
    this.rounds = ['weight', 'equility', 'inbetween', 'pyramid', 'bus']
    this.dealt = [];
    this.activePlayer = 0;
  },
  create: function() {
      this.game.cards.deck = this.shuffle(this.game.cards.deck);

      var deck_sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, this.game.cards.back);
      deck_sprite.anchor.set(0.5);

      round_text = this.game.add.text(10, 10, "Round: " + this.rounds[this.round], {"fill": "#fff"});
      round_text.anchor.setTo(0, 0);

      this.drawPlayers(this.game.players);
  },
  drawPlayers: function(players) {
        var top = 10;
        var bottom = this.game.world.height - 70;
        var left = 10;
        var right = this.game.world.width - 70;
        var centerX = this.game.world.centerX;
        var centerY = this.game.world.centerY;

        var positions = [{"x": centerX, "y": bottom}, {"x": left, "y": centerY}, {"x": centerX, "y": top}, {"x": right, "y": centerY}];
        for(var i = 0; i < players.length; i++) {
            var chip = this.game.add.sprite(positions[i].x, positions[i].y, "chip");
            var playerName = this.game.add.text(positions[i].x, positions[i].y, players[i].name, {"fill": "#fff"});

            this.playerGroups[i].add(chip);
            this.playerGroups[i].add(playerName);
        }


  },
  deal: function() {

  },
  update: function() {

  },
  xentha: function() {
    var me = this;

    // XENTHA.on('playerJoined', function (data) {
    //     var player = data.data.player;
    //     this.players.push({"xentha": player, "score": 0});
    // }.bind(this));
    //
    XENTHA.on('playerLeft', function (event) {
      this.players = this.players.filter(function(player) {
          return player.xentha.id !== event.player;
      });

      if(this.players.length === 0) {
        XENTHA.send('game.disconnect', {});
      }
    }.bind(this));
  },
  shuffle: function(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
    return a;
  }
};
