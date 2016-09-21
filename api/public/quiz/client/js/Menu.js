var QuizClient = QuizClient || {};

QuizClient.Menu = function () {};

QuizClient.Menu.prototype = {
    preload: function () {
        this.createText();
    },
    create: function () {
        this.game.stage.backgroundColor = "#eee";
        this.buttonSound = this.game.add.audio('button');
        this.xentha();
    },
    onStart: function () {
        var transition = this.game.add.tween(this.game.world).to({
            alpha: 0
        }, 1000, "Linear", true);
        transition.onComplete.add(function startGame() {
            this.state.start('Game');
        }, this);
    },
    startGame: function() {
        XENTHA.send('player.start', {});
    },
    xentha: function () {

        var me = this;

        XENTHA.callbacks["game.start"] = 'startGame';

        XENTHA.on('startGame', function(data) {
            this.onStart();
        })

        XENTHA.on('playerJoined', function(data) {
        }.bind(this));

        var style = {
            font: 'Luckiest Guy',
            fill: "#fff",
            fontSize: 100
        }

        // if(data.player.host) {
        this.game.add.text(this.game.world.centerX, -100, "Start Game", style);
        this.game.add.button(this.game.world.centerX - 100, this.game.world.centerY, 'playPressed', this.startGame, this);
        // }

    },
    update: function () {

    },
    createText: function () {

        var style = {
            font: 'Luckiest Guy',
            fill: "#fff",
            fontSize: 100
        }

        text = this.game.add.text(this.game.world.centerX, -100, "Client", style);
        text.anchor.setTo(0.5);
        this.game.add.tween(text).to({
            y: 100
        }, 2400, Phaser.Easing.Bounce.Out, true);
    },
    render: function () {

    }
};
