var Teams = Teams || {};

Teams.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
Teams.Boot.prototype = {
  preload: function() {
    //assets we'll use in the loading screen
    this.load.image('preloadbar', 'assets/images/preloader-bar.png');
  },
  create: function() {
    //loading screen will have a white background
    this.game.stage.backgroundColor = '#eee';
    // this.game.scale.pageAlignHorizontally = true;
 	// 	this.game.scale.pageAlignVertically = true;
    // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;



    //physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.state.start('Preload');
  }
};
