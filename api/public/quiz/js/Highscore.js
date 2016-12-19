var Quiz = Quiz || {};

Quiz.Highscore = function () {};

Quiz.Highscore.prototype = {
    preload: function () {
        this.createText();
    },
    create: function () {
        // this.backgroundSound = this.game.add.audio('background');
        // this.backgroundSound.loopFull(0.4);
        this.game.stage.backgroundColor = "0xff5300";
        this.scoreGroup = this.game.add.group();
        // this.buttonSound = this.game.add.audio('button');

        var scores = this.game.state.states['Game']._scores;
        this.createHighscoreText(scores);

        if(!scores) {
          console.error('Could not find highscores..?');
        }

        this.xentha();
    },
    xentha: function () {

        var me = this;

        XENTHA.on('playerClose', function (data) {
            XENTHA.send('game.disconnect', {});
        }.bind(this));
    },
    update: function () {
    },
    createHighscoreText(playerScores) {

      var scoreStyle = {
        font: 'Luckiest Guy',
        fill: "#fff",
        fontSize: 15,
        wordWrap: this.game.world.width / 2
      }

      for(var j = 0; j < playerScores.length; j++) {
        this.game.add.text(this.game.world.width / 2, this.game.world.height + Math.floor(j * 30), playerScores[j].xentha.name + ": " + playerScores[j].score, scoreStyle);
      }
    },
    createText: function () {

        var style = {
            font: 'Luckiest Guy',
            fill: "#fff",
            fontSize: 100
        }

        text = this.game.add.text(this.game.world.centerX, -100, "Highscore", style);
        text.anchor.setTo(0.5);
        this.game.add.tween(text).to({
            y: 100
        }, 2400, Phaser.Easing.Bounce.Out, true);
    },
    render: function () {

    }
};
