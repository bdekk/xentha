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
    this.scoreGroup = this.game.add.group();

    // initialize player list
    this.players = [];
    this.answersElements = {};
    for(var i = 0; i < XENTHA.players.length; i++) {
      this.players.push({xentha: XENTHA.players[i], score: 0});
    }

    this.graphics = this.game.add.graphics(0, 0);
    this.answerGraphics = this.game.add.graphics(0,0);

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
  },
  update: function() {

      // set players :)
      if(this.answersElements && this.currentQuestion) {

        var playersThatAnswered = this.players.filter(function(player) {
            return player.choice;
        });

        this.answerGraphics.clear();

        for(var i = 0; i < playersThatAnswered.length; i++) {
          var x = this.answersElements[playersThatAnswered[i].choice].x + (30 * i);
          var y = this.answersElements[playersThatAnswered[i].choice].y + 30;
          this.answerGraphics.lineStyle(0);
          var hexColor = playersThatAnswered[i].xentha.color.replace('#', '0x');
          this.answerGraphics.beginFill(hexColor, 1);
          this.answerGraphics.drawCircle(x,y, 20);
        }


        var scoreStyle = {
          font: 'Luckiest Guy',
          fill: "#fff",
          fontSize: 15,
          wordWrap: true
        }

        this.scoreGroup.removeAll();
        for(var j = 0; j < this.players.length; j++) {
          this.game.add.text(this.game.world.width - 100, 20 + Math.floor(j * 30), this.players[j].xentha.name + ": " + this.players[j].score, scoreStyle, this.scoreGroup);
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
  nextQuestion: function() {
    this.game.world.remove(this.questionGroup);
    var nQuestion = this.questions[this.game.rnd.between(0, this.questions.length - 1)];
    this.answerTime.setText(this.TIME_PER_QUESTION);

    // remove previous choices.
    this.players = this.players.map(function(player) {
        player.choice = undefined;
        return player;
    });

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
    //
    // if(this.questionGroup) {
    //   var removeTween = this.game.add.tween(this.questionGroup).to( { alpha: 0 }, 1000, "Linear", true);
    //   transition.onComplete.add(function startGame() { this.questionGroup.destroy() }, this);
    // }

    this.questionGroup = this.game.add.group();
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

    var question = this.game.add.text(this.game.world.centerX, 80, nQuestion.question, questionStyle, this.questionGroup);
    question.anchor.setTo(0.5);

    this.currentQuestion = nQuestion;
    this.game.time.events.stop();
    this.game.time.events.loop(Phaser.Timer.SECOND, this.count, this);
    this.game.time.events.start();
    // game.time.events.start();
  },
  count: function() {
    if(this.timeLeft <= 0) {
      this.game.time.events.stop();
      this.timeSound.stop();
      this.timesUpSound.play();
      this.checkAnswers();
      XENTHA.send("game.timeUp", {"answer": this.currentQuestion.answer});
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


    var playersThatAnswered = this.players.filter(function(player) {
        return player.choice;
    });

    for(var i = 0; i < playersThatAnswered.length; i++) {
      if(playersThatAnswered[i].choice == this.currentQuestion.answer) {
        playersThatAnswered[i].score += 1;
      }
    }

    // set colors of textelements :)
    for(var key in this.answersElements) {
      if (!this.answersElements.hasOwnProperty(key)) continue;
      var color = (key == this.currentQuestion.answer) ? "#009900" : "#E50000";
      this.answersElements[key].addColor(color, 0);
    }

    // new question in 4 seconds.
    var timer = this.game.time.create(false);
    timer.add(Phaser.Timer.SECOND * 4, this.nextQuestion, this);
    timer.start();
  },
  xentha: function() {
    var me = this;

    XENTHA.on('playerJoined', function (data) {
        var player = data.data.player;
        this.players.push({"xentha": player, "score": 0});
    }.bind(this));

    XENTHA.on('playerLeft', function (event) {
      this.players = this.players.filter(function(player) {
          return player.xentha.id !== event.player;
      });

      if(this.players.length === 0) {
        XENTHA.send('game.disconnect', {});
      }
    }.bind(this));

    XENTHA.on('playerAnswer', function (msg) {
      var player = this.players.find(function(player) {
          return player.xentha.id === msg.player;
      });
      player.choice = msg.data.answer;
    }.bind(this));
  },
  checkIfEndGame: function() {
  },
  endGame: function() {
    this.game.state.start('Game');
  }
};
