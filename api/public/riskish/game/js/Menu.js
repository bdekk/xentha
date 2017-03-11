var Riskish = Riskish || {};

Riskish.Menu = function () {};

Riskish.Menu.prototype = {
    preload: function () {
    },
    create: function () {
        this.connected = [];

        // background
        this.game.add.tileSprite(0, 0, 800,600, 'background');

        // sounds
        this.backgroundSound = this.game.add.audio('background');
        this.backgroundSound.loopFull(0.4);

        this.buttonSound = this.game.add.audio('button');

        //initial screen items.


        riskish = this.game.add.sprite(this.game.world.centerX, 10, 'riskish_logo');
        riskish.anchor.setTo(0.5, 0.0);

        playersRect = this.game.add.sprite(this.game.world.centerX, 70, 'rect_players');
        playersRect.scale.setTo(1, 0.8);
        playersRect.anchor.setTo(0.5, 0.0);

        playersText = this.game.add.text(this.game.world.centerX, 100, "Players", {
            fill: '#fff'
        });
        playersText.anchor.setTo(0.5);


        button = this.game.add.button(this.game.world.centerX, this.game.world.height - 100, 'start_button', this.onStart, this);
        button.onDownSound = this.buttonSound;
        button.scale.setTo(0.5, 0.5);
        button.anchor.setTo(0.5);

        this.players = this.game.add.group();

        // initialize multiplayer
        this.xentha();
    },
    onStart: function () {
        this.backgroundSound.stop();
        var transition = this.game.add.tween(this.game.world).to({
            alpha: 0
        }, 1000, "Linear", true);
        transition.onComplete.add(function startGame() {
                this.state.start('Game');
            }, this)
        XENTHA.send("game.state", {"state": "Game"});
            // this.state.start('Game');
    },
    xentha: function () {

        var me = this;

        XENTHA.on('playerJoined', function (data) {
            this.connected.push(data.data.player);
        }.bind(this));


        XENTHA.on('playerStart', function (data) {
            this.onStart();
        }.bind(this));

        XENTHA.on('playerLeft', function (event) {
          this.connected = this.connected.filter(function(player) {
              return player.xentha.id !== event.player;
          });

          if(this.connected.length === 0) {
            XENTHA.send('game.disconnect', {});
          }
        }.bind(this));
    },
    update: function () {

        for (var i = 0; i < this.connected.length; i++) {
            var name = (this.connected[i].host) ? this.connected[i].name : this.connected[i].name;
            var display = i + ". " + name;

            this.game.add.text(this.game.world.centerX, 150 + ((i + 1) * 50), display, {
                fill: this.connected[i].color
            });
        }

    },
    render: function () {

    }
};
