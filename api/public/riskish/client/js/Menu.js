var RiskishClient = RiskishClient || {};

RiskishClient.Menu = function () {};

RiskishClient.Menu.prototype = {
    preload: function () {
        this.createWaitingText();
    },
    create: function () {
        this.game.stage.backgroundColor = "#eee";
        var style = {
            font: 'Luckiest Guy',
            fill: "#0xff5300",
            fontSize: 100
        }

        this.game.add.text(this.game.world.centerX, -100, "Start Game", style, this.world);
        this.xentha();
        this.game.add.button(this.game.world.centerX - 128, this.game.world.centerY - 128, 'playPressed', this.startGame, this);
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
        XENTHA.callbacks["game.state"] = 'stateChanged';

        XENTHA.on('startGame', function(data) {
            this.onStart();
        })

        XENTHA.on('playerJoined', function(data) {
        }.bind(this));

        XENTHA.on('stateChanged', function(data) {
            if(data.state) {
                this.state.start(data.state);
            }
        }.bind(this));
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
