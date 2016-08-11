var Quiz = Quiz || {};

Quiz.Game = function(){};

Quiz.Game.prototype = {
  preload: function() {
    this.game.time.advancedTiming = true;
    this.categoryColors = [{"history": 0x62bd18, "science": 0xff5300, "entertainment": 0xd21034, "geography": 0xff475c, "technology": 0x8f16b2, "sports": 0x588c7e, "art": 0x8c4646}];
    this.bgColors = [0x62bd18, 0xff5300, 0xd21034, 0xff475c, 0x8f16b2, 0x588c7e, 0x8c4646];
    this.game.world.alpha = 1;

    this.TIME_PER_QUESTION = 4;
  },
  create: function() {
    this.coinSound = this.game.add.audio('coin');
    this.backgroundSound = this.game.add.audio('background');
    this.backgroundSound.loopFull(0.4);
    this.buttonSound = this.game.add.audio('button');
    this.timesUpSound = this.game.add.audio('timesup');
    this.timeSound = this.game.add.audio('time');

    var tintColor = this.bgColors[this.game.rnd.between(0, this.bgColors.length - 1)];
    this.game.stage.backgroundColor = tintColor;

    this.players = [];

    var style = {
      font: 'Luckiest Guy',
      fill: "#fff",
      fontSize: 60
    }
    this.answerTime = this.game.add.text(50, 50, '20', style);

    // this.xentha();
    this.nextQuestion();
    //
    // this.players = [];
    // this.initXentha();
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
  getOtherPlayers: function(player) {
    var otherPlayers = [];
    for(var i =0; i < this.players.length; i++) {
      if(this.players[i].xentha.id !== player.xentha.id) {
        otherPlayers.push(this.players[i]);
      }
    }
    return otherPlayers;
  },
  nextQuestion: function() {
    var style = {
      font: 'Luckiest Guy',
      fill: "#fff",
      fontSize: 40
    }
    this.timeLeft = this.TIME_PER_QUESTION;

    answers = ["true", "false"];

    if(this.questionGroup) {
      var removeTween = this.game.add.tween(this.questionGroup).to( { alpha: 0 }, 1000, "Linear", true);

      transition.onComplete.add(function startGame() { this.questionGroup.destroy() }, this);
    }

    this.questionGroup = this.game.add.group();
    // this.questionGroup.alpha = 0;

    this.answersElements = {};

    for(var j =0; j < answers.length; j++) {
      var answerBox = new Phaser.Rectangle(100 + ((j + 1) * 120), 400, 100, 100);
      var answerText = this.game.add.text(100 + ((j + 1) * 120), 400, answers[j], style, this.questionGroup);
      this.answersElements[answers[j]] = answerText;
    }


    var question = this.game.add.text(this.game.world.centerX, 200, "Question 1 is a very long one.", style, this.questionGroup);
    question.anchor.setTo(0.5);

    this.game.time.events.loop(Phaser.Timer.SECOND, this.count, this);

    // this.game.add.tween(this.questionGroup).to( { alpha: 1 }, 1000, "Linear", true);
  },
  count: function() {
    if(this.timeLeft <= 0) {
      this.game.time.events.stop();
      this.timeSound.stop();
      this.timesUpSound.play();
      this.checkAnswers();
      this.timeLeft = this.TIME_PER_QUESTION;
    } else {
      this.timeLeft -= 1;
      this.answerTime.setText(this.timeLeft);
    }

    if(this.timeLeft == Math.floor(this.TIME_PER_QUESTION / 3)) {
      this.timeSound.loopFull(0.4);
    }
  },
  checkAnswers: function() {
      this.answersElements["true"].addColor("#009900", 0);
      this.answersElements["false"].addColor("#E50000", 0);
  },
  xentha: function() {
    var me = this;
    XENTHA.playerJoined = function(data) {
      // XENTHA.setLayout(XENTHA.layouts.CONTROLLER);
      // // data.players.forEach(function(xPlayer, index) {
      // var player = me.game.add.sprite(100, 200, 'player');
      // player.gun = me.game.add.sprite(0, 0, 'gun');
      // player.addChild(player.gun);
      // player.gun.anchor.setTo(-.5, -.3);
      //
      // me.game.physics.arcade.enable(player);
      // player.body.collideWorldBounds=true;
      // player.body.gravity.y = 1000;
      //
      // // set default lives.
      // player.lives = this.lives;
      // player.xentha = data.player;
      // me.players.push(player);
    }

    XENTHA.playerLeft = function(data) {
      // console.log('player left.. ');
      // var index = me.players.map(function(player) {return player.xentha.id; }).indexOf(data.player.id);
      // me.players[index].destroy();
      // me.players.splice(index);
    }

    XENTHA.onInput = function(data) {
      // for(var i = 0; i < me.players.length; i++){
      //   if(me.players[i].xentha.id == data.player) {
      //     me.players[i].xentha.input.push({id: data.input.id, pressed: data.input.pressed});
      //   }
      // }
    }
  },
  checkIfEndGame: function() {
  },
  endGame: function() {
    this.game.state.start('Game');
  }
};
