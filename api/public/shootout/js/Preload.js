var Shooter = Shooter || {};

//loading the game assets
Shooter.Preload = function(){};

Shooter.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    // this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('level3', 'assets/tilemaps/level3.json', null, Phaser.Tilemap.TILED_JSON);

    this.load.image('gameTiles', 'assets/images/tiles_spritesheet.png');

    this.load.image('player', 'assets/images/player_front.png');
    this.load.image('playerDuck', 'assets/images/player_duck.png');
    this.load.image('playerHurt', 'assets/images/player_hurt.png');
    this.load.image('playerLeft', 'assets/images/player_left.png');
    this.load.image('playerJump', 'assets/images/player_jump.png');
    this.load.image('playerRight', 'assets/images/player_right.png');
    this.load.image('playerDead', 'assets/images/player_dead.png');
    this.load.image('goldCoin', 'assets/images/goldCoin.png');
    this.load.image('bullet', 'assets/images/bullet.png');

    // this.load.image('cloud1', 'assets/images/cloud1.png');
    // this.load.image('bg', 'assets/images/bg.png');

    this.load.audio('coin', ['assets/audio/coin.ogg', 'assets/audio/coin.mp3']);
  },
  create: function() {
    this.state.start('Game');
  }
};
