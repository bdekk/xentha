var BussenClient = BussenClient || {};

//loading the game assets
BussenClient.Preload = function(){};

BussenClient.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    // this.load.image('goldCoin', 'assets/images/goldCoin.png');
  },
  create: function() {
    this.game.time.events.add(Phaser.Timer.SECOND, function() { this.state.start('Menu')}, this);
    // this.state.start('Menu');
  }
};
