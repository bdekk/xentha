var BussenClient = BussenClient || {};

BussenClient.Game = function(){};

BussenClient.Game.prototype = {
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
  createAnswerElements: function(answers) {
      this.game.world.removeAll();
      this.questionGroup = this.game.add.group();
      // this.questionGroup.alpha = 0;

      this.answersElements = {};
      var startY =  50;
      var height = 100;
      var width = 500;
      var x = this.game.world.centerX - (width / 2);
      var keys = Object.keys(answers);

      var answerStyle = {
        font: 'Luckiest Guy',
        fill: "#fff",
        fontSize: 20,
        wordWrap: true,
        wordWrapWidth: width * 0.7
      }

      for(var j =0; j < keys.length; j++) {
        var key = keys[j];
        var extraY = (Math.floor(j * (height * 1.5)));
        var y = startY + extraY;
        // this.graphics.beginFill(0xffffff);
        // this.graphics.lineStyle(1, 0xaaaaaa, 1);
        // this.graphics.drawRect(x, y, width, height);

        button = this.game.add.button(x, y, 'quizButton', this.answer, this, 0, 0, 1);
        button.scale.setTo(width/864, height/475);
        // button.anchor.setTo(0.5, 0.5);
        button.answerKey = key;
        // button.scale.setTo(button.width / width, button.height / height);

        var answerText = this.game.add.text(Math.floor(x + width / 2),Math.floor(y + height / 2), answers[key], answerStyle, this.questionGroup);
        answerText.anchor.setTo(0.5);
        this.answersElements[key] = answerText;
      }
      this.game.world.bringToTop(this.questionGroup);
  },
  answer: function(button) {
      this.chosenAnswer = button.answerKey;
      XENTHA.send('player.answer', {"answer": button.answerKey});
      button.frame = 1;
  },
  timeUp: function(answer) {
      this.game.world.removeAll();

      var style = {
        font: 'Luckiest Guy',
        fill: "#E50000",
        fontSize: 50,
        wordWrap: true,
        wordWrapWidth: this.game.width * 0.7
      }

      var answerText = "Unfortunate..";
      if(this.chosenAnswer == answer) {
            style.fill = "#009900";
            answerText = "Good job ";
      }
      this.game.add.text(this.game.world.centerX - 100, this.game.world.centerY - 100, answerText, style);
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

    XENTHA.callbacks["game.state"] = 'stateChanged';

    XENTHA.on('game.start', function(data) {
            console.log('wildcard .. ');
    });


    XENTHA.on('stateChanged', function(data) {
        if(data.state) {
            this.state.start(data.state);
        }
    }.bind(this));

    XENTHA.on('player.joined', function(data) {
        console.log(data);
    });

    XENTHA.on('player.left', function(data) {
        console.log(data);
    });

    XENTHA.on('nextQuestion', function(data) {
        me.createAnswerElements(data.answers);
    });

    XENTHA.on('timeUp', function(data) {
        me.timeUp(data.answer);
    });
    //
    // XENTHA.playerJoined = function(data) {
    // }
    //
    // XENTHA.playerLeft = function(data) {
    // }
  }
};
