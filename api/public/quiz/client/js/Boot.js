var QuizClient = QuizClient || {};

QuizClient.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
QuizClient.Boot.prototype = {
  preload: function() {
    //assets we'll use in the loading screen
    this.load.image('preloadbar', 'assets/images/preloader-bar.png');
  },
  create: function() {
    //loading screen will have a white background
    this.game.stage.backgroundColor = '#eee';

    this.game.scale.pageAlignHorizontally = true;
 		this.game.scale.pageAlignVertically = true;
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.state.start('Preload');
  }
};
