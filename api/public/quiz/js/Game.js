var Quiz = Quiz || {};

Quiz.Game = function(){};

Quiz.Game.prototype = {
  preload: function() {
    this.game.time.advancedTiming = true;
    this.categoryColors = [{"history": 0x62bd18, "science": 0xff5300, "entertainment": 0xd21034, "geography": 0xff475c, "technology": 0x8f16b2, "sports": 0x588c7e, "art": 0x8c4646}];
    this.bgColors = [0x62bd18, 0xff5300, 0xd21034, 0xff475c, 0x8f16b2, 0x588c7e, 0x8c4646];
    this.game.world.alpha = 1;

    this.TIME_PER_QUESTION = 20;
  },
  create: function() {
    this.questions = this.game.cache.getJSON('data');
    this.coinSound = this.game.add.audio('coin');
    this.backgroundSound = this.game.add.audio('background');
    this.backgroundSound.loopFull(0.4);
    this.buttonSound = this.game.add.audio('button');
    this.timesUpSound = this.game.add.audio('timesup');
    this.timeSound = this.game.add.audio('time');

    // initialize player list
    this.players = [];
    for(var i = 0; i < XENTHA.players.length; i++) {
      this.players.push({xentha: XENTHA.players[i]});
    }

    this.graphics = this.game.add.graphics(0, 0);

    var tintColor = this.bgColors[this.game.rnd.between(0, this.bgColors.length - 1)];
    this.game.stage.backgroundColor = tintColor;

    var style = {
      font: 'Luckiest Guy',
      fill: "#fff",
      fontSize: 40
    }
    this.answerTime = this.game.add.text(50, 50, this.TIME_PER_QUESTION, style);

    this.xentha();
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

    var nQuestion = this.questions[this.game.rnd.between(0, this.questions.length - 1)];

    // answers is the object without question and answer.
    var answers = {};
    answers["A"] = nQuestion["A"];
    answers["B"] = nQuestion["B"];
    answers["C"] = nQuestion["C"];
    answers["D"] = nQuestion["D"];


    XENTHA.send("game.nextQuestion", {"question": nQuestion, "answers": answers});

    var questionStyle = {
      font: 'Luckiest Guy',
      fill: "#fff",
      fontSize: 40,
      wordWrap: true,
      wordWrapWidth: this.game.world.width * 0.7
    }

    this.timeLeft = this.TIME_PER_QUESTION;

    if(this.questionGroup) {
      var removeTween = this.game.add.tween(this.questionGroup).to( { alpha: 0 }, 1000, "Linear", true);
      transition.onComplete.add(function startGame() { this.questionGroup.destroy() }, this);
    }

    this.questionGroup = this.game.add.group();
    // this.questionGroup.alpha = 0;

    this.answersElements = {};
    var startY =  this.game.world.centerY - 100;
    var height = 150;
    var width = 250;
    var keys = Object.keys(answers);

    var answerStyle = {
      font: 'Luckiest Guy',
      fill: "#aaa",
      fontSize: 20,
      wordWrap: true,
      wordWrapWidth: width * 0.7
    }

    // var clientLayout = [];
    // for(var i =0; i < keys.length; i++) {
    //   var key = keys[i];
    //   var height = 100;
    //   var y = 100 + (i * (height * 1.5));
    //   clientLayout.push({
    //       type: 'button',
    //       width: 100,
    //       height: height,
    //       x: 100,
    //       y: y,
    //       text:  answers[key],
    //       id: key
    //   });
    // };

    for(var j =0; j < keys.length; j++) {
      var key = keys[j];

      var x = 100 + ((j%2) * (width * 1.5));
      var extraY = (Math.floor(j / 2) * (height * 1.5));
      var y = startY + extraY;
      this.graphics.beginFill(0xffffff);
      this.graphics.lineStyle(1, 0xaaaaaa, 1);
      this.graphics.drawRect(x, y, width, height);

      var answerText = this.game.add.text(Math.floor(x + width / 2),Math.floor(y + height / 2), answers[key], answerStyle, this.questionGroup);
      answerText.anchor.setTo(0.5);
      this.answersElements[key] = answerText;
    }

    var question = this.game.add.text(this.game.world.centerX, 50, nQuestion.question, questionStyle, this.questionGroup);
    question.anchor.setTo(0.5);

    this.currentQuestion = nQuestion;
    this.game.time.events.loop(Phaser.Timer.SECOND, this.count, this);
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

    // set players :)
    for(var i = 0; i < this.players.length; i++) {
      var x = this.answersElements[this.players[i].choice].x + (30 * i);
      var y = this.answersElements[this.currentQuestion.answer].y + 30;
      this.graphics.lineStyle(0);
      this.graphics.beginFill(this.players[i].xentha.color, 1);
      this.graphics.drawCircle(x,y, 20);
    }

    // set colors of textelements :)
    for(var key in this.answersElements) {
      if (!this.answersElements.hasOwnProperty(key)) continue;
      var color = (key == this.currentQuestion.answer) ? "#009900" : "#E50000";
      this.answersElements[key].addColor(color, 0);
    }


  },
  xentha: function() {
    var me = this;

    XENTHA.on('playerJoined', function (data) {
        this.players.push(data.player);
    }.bind(this));

    XENTHA.on('playerLeft', function (data) {
      this.players = this.players.filter(function (player) {
          return player.id !== data.player.id;
      });
    }.bind(this));

    XENTHA.on('playerAnswer', function (msg) {
      var player = this.players.find(function(player) {
          return player.xentha.id === msg.player;
      });
      player.choice = msg.data.answer;
    }.bind(this));

    // XENTHA.onInput = function(data) {
    //   if(data.input.pressed) {
    //     for(var i = 0; i < me.players.length; i++){
    //       if(me.players[i].xentha.id == data.player) {
    //         me.players[i].choice = data.input.id;
    //         break;
    //       }
    //     }
    //   }
    // }
  },
  checkIfEndGame: function() {
  },
  endGame: function() {
    this.game.state.start('Game');
  }
};
