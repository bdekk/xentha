var BussenClient = BussenClient || {};

BussenClient.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
BussenClient.Boot.prototype = {
  preload: function() {
    //assets we'll use in the loading screen
    this.load.image('preloadbar', 'assets/img/preloader-bar.png');
  },
  create: function() {
    this.game.stage.background = '#eee';

    this.game.scale.pageAlignHorizontally = true;
 		this.game.scale.pageAlignVertically = true;
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.state.start('Preload');
  }
};
