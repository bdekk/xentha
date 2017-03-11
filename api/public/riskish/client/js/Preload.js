var RiskishClient = RiskishClient || {};

//loading the game assets
RiskishClient.Preload = function(){};

RiskishClient.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    this.load.image('goldCoin', 'assets/images/goldCoin.png');
    this.load.image('playUnpressed', 'assets/images/buttons/unpressed/yellow/play.png');
    this.load.image('playPressed', 'assets/images/buttons/pressed/yellow/play.png');
    this.load.spritesheet('quizButton', 'assets/images/answer_buttons1728x475.png', 864, 475);

    this.load.audio('background', ['assets/audio/background.mp3']);
    this.load.audio('coin', ['assets/audio/coin.mp3']);
    this.load.audio('button', ['assets/audio/button.wav']);
    this.load.audio('time', ['assets/audio/time.wav']);
    this.load.audio('timesup', ['assets/audio/timeup.wav']);
  },
  create: function() {
    this.game.time.events.add(Phaser.Timer.SECOND, function() { this.state.start('Menu')}, this);
    // this.state.start('Menu');
  }
};
