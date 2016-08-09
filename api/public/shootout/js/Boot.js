var Shooter = Shooter || {};

Shooter.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
Shooter.Boot.prototype = {
  preload: function() {
    //assets we'll use in the loading screen
    this.load.image('preloadbar', 'assets/images/preloader-bar.png');
  },
  create: function() {
    //loading screen will have a white background
    this.game.stage.backgroundColor = '#eee';
    // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // this.game.scale.pageAlignHorizontally = true;
    // this.game.scale.pageAlignVertically = true;
    // this.game.scale.setScreenSize(true);
    // this.game.scale.updateLayout(true);

    // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // this.scale.minWidth = 480;
    // this.scale.minHeight = 260;
    // this.scale.maxWidth = 1024;
    // this.scale.maxHeight = 768;
    // this.scale.forceLandscape = true;
    // this.scale.pageAlignHorizontally = true;
    this.scale.updateLayout(true);


    //physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.state.start('Preload');
  }
};
