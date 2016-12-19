var QuizClient = QuizClient || {};

QuizClient.Highscore = function () {};

QuizClient.Highscore.prototype = {
    preload: function () {

    },
    create: function () {
        this.game.stage.backgroundColor = "#eee";
        var style = {
            font: 'Luckiest Guy',
            fill: "#0xff5300",
            fontSize: 100
        }

        this.game.add.text(this.game.world.centerX, -100, "Close Game", style, this.world);
        this.xentha();
        this.game.add.button(this.game.world.centerX - 128, this.game.world.centerY - 128, 'playPressed', this.closeGame, this);
    },
    closeGame: function() {
        XENTHA.send('player.close', {});
    },
    xentha: function () {

        var me = this;
    },
    update: function () {
    },
    render: function () {
    }
};
