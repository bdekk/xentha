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


  	this.game.load.image('a', 'client/assets/images/button-a.png');
  	this.game.load.image('b', 'client/assets/images/button-b.png');
  	this.game.load.image('up', 'client/assets/images/button-up.png');
  	this.game.load.image('down', 'client/assets/images/button-down.png');
  	this.game.load.image('right', 'client/assets/images/button-right.png');
  	this.game.load.image('left', 'client/assets/images/button-left.png');
  },
  create: function() {
    this.state.start('Game');
  }
};
