var Quiz = Quiz || {};

Quiz.Menu = function () {};

Quiz.Menu.prototype = {
    preload: function () {
        this.createText();
    },
    create: function () {
        this.backgroundSound = this.game.add.audio('background');
        this.backgroundSound.loopFull(0.4);
        this.game.stage.backgroundColor = "0xff5300";
        this.buttonSound = this.game.add.audio('button');

        this.connected = XENTHA.players;

        playersText = this.game.add.text(100, this.game.world.centerY, "Players", {
            fill: '#fff'
        });
        button = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'playPressed', this.onStart, this);
        button.onDownSound = this.buttonSound;
        button.scale.setTo(0.5, 0.5);
        button.anchor.setTo(0.5);
        // playersText.anchor.setTo(0.5);

        this.players = this.game.add.group();
        this.players.backgroundColor = "#eee";

        // var sprite = this.game.add.graphics(this.game.world.centerY, this.game.world.centerX);
        // sprite.beginFill(Phaser.Color.getRandomColor(100, 255), 1);
        // sprite.bounds = new PIXI.Rectangle(0, 0, 100, 400);
        // sprite.drawRect(0, 0, 100, 400);
        //
        // players.add(sprite);
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
            this.connected.push(data.player);
        }.bind(this));


        XENTHA.on('playerStart', function (data) {
            this.onStart();
        }.bind(this));

        XENTHA.on('playerLeft', function (data) {
            //   console.log('player left.. ');
            var index = me.connected.map(function (player) {
                return player.id;
            }).indexOf(data.player.id);
            me.connected.splice(index);
        }.bind(this));
        // XENTHA.playerJoined = function(data) {
        // XENTHA.setLayout(XENTHA.layouts.CONTROLLER);
        // data.players.forEach(function(xPlayer, index) {
        // this.players.
        //   me.connected.push(data.player);
        //   if(data.player.host) {
        //     XENTHA.send({
        //       player: data.player.id,
        //       event: 'game.layout.add',
        //       data: {
        //         layout: [{
        //             type: 'button',
        //             width: 100,
        //             height: 100,
        //             x: 100,
        //             y: 100,
        //             text: 'Start Quiz!',
        //             id: 'start'
        //         }]
        //       }
        //     });
        //   }

        //   XENTHA.send({
        //     event: 'game.layout.add',
        //     data: {
        //       layout: [{
        //           type: 'text',
        //           x: 200,
        //           y: 200,
        //           size: 20,
        //           value: 'Connected.'
        //       }]
        //     }
        //   })
        //
    },
    update: function () {

        for (var i = 0; i < this.connected.length; i++) {
            var name = (this.connected[i].host) ? this.connected[i].name : this.connected[i].name;
            this.game.add.text(100, this.game.world.centerY + ((i + 1) * 50), name, {
                fill: this.connected[i].color
            });
        }

    },
    createText: function () {

        var style = {
            font: 'Luckiest Guy',
            fill: "#fff",
            fontSize: 100
        }

        text = this.game.add.text(this.game.world.centerX, -100, "Quiz", style);
        text.anchor.setTo(0.5);
        this.game.add.tween(text).to({
            y: 100
        }, 2400, Phaser.Easing.Bounce.Out, true);
    },
    render: function () {

    }
};
