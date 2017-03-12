var Bussen = Bussen || {};

Bussen.Game = function(){};

Bussen.Game.prototype = {
  preload: function() {
    this.game.world.alpha = 1;
    // this.backgroundSound = this.game.add.audio('background');
    // this.backgroundSound.loopFull(0.4);
    this.game.players = [{"name": "Bram", cards: []}, {"name": "Jarno", cards: []}, {"name": "Rutger", cards: []}, {"name": "Chiel", cards: []}];
    this.game.players = this.addPositions(this.game.players);

    this.playerGroups = [];

    for(var i = 0; i < this.game.players.length; i++) {
        this.playerGroups.push(this.game.add.group());
    }

    this.round = 0;
    this.rounds = ['weight', 'inbetween', 'equility', 'pyramid', 'bus']

    this.dealCards = false;
    this.dealt = [];
    this.activePlayer = 0;
  },
  create: function() {
      this.game.cards.deck = this.shuffle(this.game.cards.deck);

      var deck_sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, this.game.cards.back);
      deck_sprite.scale.set(0.4);
      deck_sprite.anchor.set(0.5);

      round_text = this.game.add.text(10, 10, "Round: " + this.rounds[this.round], {"fill": "#fff"});
      round_text.anchor.setTo(0, 0);

      this.drawPlayers(this.game.players);

      // fake input for now :) later on hook this to xentha.
      var aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
      aKey.onDown.add(this.dealInput, this);

      var bKey = this.game.input.keyboard.addKey(Phaser.Keyboard.B);
      bKey.onDown.add(this.higherInput, this);

      var cKey = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
      cKey.onDown.add(this.lowerInput, this);

      var dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
      dKey.onDown.add(this.inInput, this);

      var eKey = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
      eKey.onDown.add(this.outInput, this);

      this.activePlayerChip = this.game.add.sprite(this.game.players[this.activePlayer].ui.position.x, this.game.players[this.activePlayer].ui.position.y + 40, "chip");
      this.activePlayerChip.anchor.set(0.5);
  },
  // placeholder inputs.
  higherInput: function() {
      this.game.players[this.activePlayer].answer = 'higher';
  },
  lowerInput: function() {
      this.game.players[this.activePlayer].answer = 'lower';
  },
  inInput: function() {
      this.game.players[this.activePlayer].answer = 'in';
  },
  outInput: function() {
      this.game.players[this.activePlayer].answer = 'out';
  },
  dealInput: function() {
      this.dealCards = true;
  },
  addPositions(players) {
      var top = 10;
      var bottom = this.game.world.height - 120;
      var left = 70;
      var right = this.game.world.width - 70;
      var centerX = this.game.world.centerX;
      var centerY = this.game.world.centerY;

      var positions = [{"x": centerX, "y": bottom}, {"x": left, "y": centerY}, {"x": centerX, "y": top}, {"x": right, "y": centerY}];
      for(var j = 0; j < players.length; j++) {
          players[j].ui = {};
          players[j].ui.position = positions[j];
      }
      return players;
  },
  drawPlayers: function(players) {
      for(var i = 0; i < players.length; i++) {
          var player = players[i];
          var playerName = this.game.add.text(player.ui.position.x, player.ui.position.y, player.name, {"fill": "#fff"});
          playerName.anchor.set(0.5, 0);
          this.playerGroups[i].add(playerName);
      }
  },
  drawPlayerCards: function(player) {
      for(var j = 0; j < player.cards.length; j++) {
          var card = this.game.add.sprite(player.ui.position.x + (j * 30), player.ui.position.y + 40, player.cards[j].sprite);
          card.scale.set(0.4);
          card.anchor.set(0.5, 0);
        //   this.playerGroups[i].add(card);
      }
  },
  drawPlayerAnswer: function(player) {
      if(player.answer) {
          var playerAnswer = this.game.add.text(player.ui.position.x, player.ui.position.y - 50, player.answer, {"fill": "#f00"});
          playerAnswer.anchor.set(0.5, 0);
      }
  },
  deal: function() {
      var playerCards = this.game.players[this.activePlayer].cards;
      playerCards.push(this.game.cards.deck.pop());
  },
  nextTurn: function() {
      if(this.game.players.length - 1 === this.activePlayer) {
          this.activePlayer = 0;
          this.round++;
      } else {
          this.activePlayer++;
      }
  },
  update: function() {
      // draw dynamic player items
      for(var i = 0; i < this.game.players.length; i++) {
          var player = this.game.players[i];
          this.drawPlayerCards(player);
          this.drawPlayerAnswer(player);
      }

      // draw active player chip
      this.activePlayerChip.position.set(this.game.players[this.activePlayer].ui.position.x, this.game.players[this.activePlayer].ui.position.y + 70);

      // deal card if needed
      if(this.dealCards) {
          this.deal();
          this.dealCards = false;
      }

      //execute round logic.
      this.executeGameLogic();
  },
  executeGameLogic: function() {
      switch(this.round) {
        case 0:
            this.checkRoundWeight();
            break;
        case 1:
            this.checkRoundInbetween();
            break;
        case 2:
            this.checkRoundEquility();
            break;
        case 3:
            this.checkRoundPyramid();
            break;
        case 4:
            this.checkRoundBus();
            break;
        default:
            console.log('could not find round.');
      }
  },
  checkRoundWeight: function() {
      var activePlayer = this.game.players[this.activePlayer];
      if(!activePlayer.answer || activePlayer.cards.length === 0) {
          return;
      }

      if(activePlayer.answer && activePlayer.cards.length == 2) {
          var calculatedAnswer = (activePlayer.cards[0].value < activePlayer.cards[1].value) ? 'higher' : 'lower';
          if(activePlayer.answer === calculatedAnswer) {
              // you guessed right!
              console.log('no shots for you!');
          } else {
              // you guessed wrong.
              console.log('shots!');
          }
          this.nextTurn();
      }
  },
  checkRoundEquility: function() {
      var activePlayer = this.game.players[this.activePlayer];
      if(!activePlayer.answer || activePlayer.cards.length === 0) {
          return;
      }


  },
  checkRoundInbetween: function() {
      var activePlayer = this.game.players[this.activePlayer];
      if(!activePlayer.answer || activePlayer.cards.length === 0) {
          return;
      }

      if(activePlayer.answer && activePlayer.cards.length == 3) {
          var firstSmallSecondLarge = activePlayer.cards[0].value < activePlayer.cards[2] && activePlayer.cards[1] > activePlayer.cards[2];
          var firstLargeSecondSmall = activePlayer.cards[1].value < activePlayer.cards[2] && activePlayer.cards[0] > activePlayer.cards[2];
          var calculatedAnswer = (firstSmallSecondLarge || firstLargeSecondSmall) ? 'in' : 'out';

          if(activePlayer.answer === calculatedAnswer) {
              // you guessed right!
              console.log('no shots for you!');
          } else {
              // you guessed wrong.
              console.log('shots!');
          }
          this.nextTurn();
      }
  },
  checkRoundPyramid: function() {

  },
  checkRoundBus: function() {

  },
  xentha: function() {
    var me = this;

    XENTHA.on('playerLeft', function (event) {
      this.players = this.players.filter(function(player) {
          return player.xentha.id !== event.player;
      });

      if(this.players.length === 0) {
        XENTHA.send('game.disconnect', {});
      }
    }.bind(this));

    XENTHA.on('playerAnswer', function (event) {
        var player = this.game.players.find(function(player) {
            return player.xentha.id === event.player;
        });
        player.answer = event.data.answer;
    }.bind(this));

    XENTHA.on('playerDeal', function (event) {
        this.dealCards = true;
        // var player = this.players.find(function(player) {
        //     return player.xentha.id === msg.player;
        // });
        // player.choice = msg.data.answer;
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
