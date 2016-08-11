var Quiz = Quiz || {};

Quiz.Menu = function(){};

Quiz.Menu.prototype = {
  preload: function() {
    me = this;
    WebFontConfig = {

      //  'active' means all requested fonts have finished loading
      //  We set a 1 second delay before calling 'createText'.
      //  For some reason if we don't the browser cannot render the text the first time it's created.
      active: function() { me.game.time.events.add(Phaser.Timer.SECOND, me.createText, me); },

      //  The Google Fonts we want to load (specify as many as you like in the array)
      google: { families: [ 'Luckiest+Guy::latin' ] }

    };


    this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
  },
  create: function() {
    this.backgroundSound = this.game.add.audio('background');
    this.backgroundSound.loopFull(0.4);
    this.game.stage.backgroundColor = "0xff5300";
  },
  createText: function() {

    var style = {
      font: 'Luckiest Guy',
      fill: "#fff",
      fontSize: 100
    }

    text = this.game.add.text(this.game.world.centerX, -100, "Quiz", style);
    text.anchor.setTo(0.5);
    this.game.add.tween(text).to( { y: 100 }, 2400, Phaser.Easing.Bounce.Out, true);
  },
  render: function() {

  }
};
