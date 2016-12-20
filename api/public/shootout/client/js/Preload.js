var ShooterClient = ShooterClient || {};

//loading the game assets
ShooterClient.Preload = function(){};

ShooterClient.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);
  },
  create: function() {
    this.state.start('Game');
  }
};
