var Teams = Teams || {};

Teams.Preload = function(){};

Teams.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    this.load.tilemap('level1', 'assets/tiles/level1.json', null, Phaser.Tilemap.TILED_JSON);

    this.load.image('medieval_tilesheet', 'assets/tiles/medieval_tilesheet.png');
    this.load.image('towerDefense_tilesheet', 'assets/tiles/towerDefense_tilesheet.png');
    this.load.image('scifi_tilesheet', 'assets/tiles/scifi_tilesheet.png');

    this.load.image('player', 'assets/images/player/tankGreen_outline.png');

    // this.load.image('cloud1', 'assets/images/cloud1.png');
    // this.load.image('bg', 'assets/images/bg.png');

    // this.load.audio('coin', ['assets/audio/coin.ogg', 'assets/audio/coin.mp3']);
  },
  create: function() {
    console.log('game');
    this.state.start('Game');
  }
};
