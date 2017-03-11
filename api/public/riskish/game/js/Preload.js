var Riskish = Riskish || {};

//loading the game assets
Riskish.Preload = function(){};

Riskish.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    this.load.image('background', 'assets/img/bg.jpg');
    this.load.image('start_button', 'assets/img/game/start_button.png');
    this.load.image('rect_players', 'assets/img/game/rect_players.png');
    this.load.image('riskish_logo', 'assets/img/game/riskish.png');
    this.load.image('sea', 'assets/img/game/sea.png');


    this.load.image('metal', 'assets/img/game/tiles/metal.png');
    this.load.image('grass', 'assets/img/game/tiles/grass.png');
    this.load.image('sand', 'assets/img/game/tiles/sand.png');
    this.load.image('ice', 'assets/img/game/tiles/ice.png');
    this.load.image('future', 'assets/img/game/tiles/future.png');

    // this.load.audio('background', ['assets/audio/background.mp3']);
    // this.load.audio('coin', ['assets/audio/coin.mp3']);
    // this.load.audio('button', ['assets/audio/button.wav']);
    // this.load.audio('time', ['assets/audio/time.wav']);
    // this.load.audio('timesup', ['assets/audio/timeup.wav']);

    // this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
  },
  create: function() {
    this.game.time.events.add(Phaser.Timer.SECOND, function() { this.state.start('Menu')}, this);
    // this.state.start('Menu');
  }
};
