var Quiz = Quiz || {};

//loading the game assets
Quiz.Preload = function(){};

Quiz.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    this.load.image('goldCoin', 'assets/images/goldCoin.png');
    this.load.image('playUnpressed', 'assets/images/buttons/unpressed/yellow/play.png');
    this.load.image('playPressed', 'assets/images/buttons/pressed/yellow/play.png');

    this.load.audio('background', ['assets/audio/background.mp3']);
    this.load.audio('coin', ['assets/audio/coin.mp3']);
    this.load.audio('button', ['assets/audio/button.wav']);
    this.load.audio('time', ['assets/audio/time.wav']);
    this.load.audio('timesup', ['assets/audio/timeup.wav']);

    WebFontConfig = {

      //  'active' means all requested fonts have finished loading
      //  We set a 1 second delay before calling 'createText'.
      //  For some reason if we don't the browser cannot render the text the first time it's created.
      // active: function() { me.game.time.events.add(Phaser.Timer.SECOND, me.createText, me); },

      //  The Google Fonts we want to load (specify as many as you like in the array)
      google: { families: [ 'Luckiest+Guy::latin' ] }

    };


    this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
  },
  create: function() {
    this.game.time.events.add(Phaser.Timer.SECOND, function() { this.state.start('Menu')}, this);
    // this.state.start('Menu');
  }
};
