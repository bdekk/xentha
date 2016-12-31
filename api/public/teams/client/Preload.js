var TeamsClient = TeamsClient || {};

TeamsClient.Preload = function(){};

TeamsClient.Preload.prototype = {
  preload: function() {
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    // this.load.tilemap('level1', 'assets/tiles/level1.json', null, Phaser.Tilemap.TILED_JSON);
    //
    // this.load.image('medieval_tilesheet', 'assets/tiles/medieval_tilesheet.png');
    // this.load.image('towerDefense_tilesheet', 'assets/tiles/towerDefense_tilesheet.png');
    // this.load.image('scifi_tilesheet', 'assets/tiles/scifi_tilesheet.png');
    //
    this.load.image('up', 'assets/images/controls/up.png');
    this.load.image('left', 'assets/images/controls/left.png');
    this.load.image('right', 'assets/images/controls/right.png');
    this.load.image('down', 'assets/images/controls/down.png');
    this.load.image('a', 'assets/images/controls/a.png');
    this.load.image('b', 'assets/images/controls/b.png');

    // this.load.image('cloud1', 'assets/images/cloud1.png');
    // this.load.image('bg', 'assets/images/bg.png');

    // this.load.audio('coin', ['assets/audio/coin.ogg', 'assets/audio/coin.mp3']);
  },
  create: function() {
    this.state.start('Game');
  }
};
