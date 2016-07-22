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

    this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    // this.game.scale.minWidth = 480;
    // this.game.scale.minHeight = 260;
    this.game.scale.maxWidth = window.innerWidth;
    this.game.scale.maxHeight = window.innerHeight;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.updateLayout(true);

    //physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.state.start('Preload');
  }
};
