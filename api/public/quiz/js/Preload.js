var Quiz = Quiz || {};

//loading the game assets
Quiz.Preload = function(){};

Quiz.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    this.load.image('goldCoin', 'assets/images/goldCoin.png');

    this.load.audio('background', ['assets/audio/background.mp3']);
    this.load.audio('coin', ['assets/audio/coin.mp3']);
  },
  create: function() {
    this.state.start('Menu');
  }
};
