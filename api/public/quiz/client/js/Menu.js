var QuizClient = QuizClient || {};

QuizClient.Menu = function () {};

QuizClient.Menu.prototype = {
    preload: function () {
        this.createWaitingText();
    },
    create: function () {
        this.game.stage.backgroundColor = "#eee";
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
    createWaitingText: function () {

        var style = {
            font: 'Luckiest Guy',
            fill: "#fff",
            fontSize: 50
        }

        this.game.add.text(this.game.world.centerX, -100, "Waiting...", style);
    },
    render: function () {

    }
};
