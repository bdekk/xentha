var ShooterClient = ShooterClient || {};

ShooterClient.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
ShooterClient.Boot.prototype = {
  preload: function() {
    //assets we'll use in the loading screen
    this.load.image('preloadbar', 'assets/images/preloader-bar.png');
  },
  create: function() {
    //loading screen will have a white background
    this.game.stage.backgroundColor = '#eee';
    this.scale.updateLayout(true);

    this.state.start('Preload');
  }
};
