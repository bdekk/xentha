var Bussen = Bussen || {};

//loading the game assets
Bussen.Preload = function(){};

Bussen.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    this.load.image('start_button', 'assets/img/game/start_button.png');
    this.load.image('rect_players', 'assets/img/game/rect_players.png');
    this.load.image('bussen_logo', 'assets/img/game/bussen.png');
    this.load.image('background', 'assets/img/background.png');
    this.load.image('chip', 'assets/img/game/chipGreen.png');

    this.load.image('card_back', 'assets/img/cards/cardBack_red3.png');

    this.load.image('cardClubs2', 'assets/img/cards/cardClubs2.png');
    this.load.image('cardClubs3', 'assets/img/cards/cardClubs3.png');
    this.load.image('cardClubs4', 'assets/img/cards/cardClubs4.png');
    this.load.image('cardClubs5', 'assets/img/cards/cardClubs5.png');
    this.load.image('cardClubs6', 'assets/img/cards/cardClubs6.png');
    this.load.image('cardClubs7', 'assets/img/cards/cardClubs7.png');
    this.load.image('cardClubs8', 'assets/img/cards/cardClubs8.png');
    this.load.image('cardClubs9', 'assets/img/cards/cardClubs9.png');
    this.load.image('cardClubs10', 'assets/img/cards/cardClubs10.png');
    this.load.image('cardClubsJ', 'assets/img/cards/cardClubsJ.png');
    this.load.image('cardClubsQ', 'assets/img/cards/cardClubsQ.png');
    this.load.image('cardClubsK', 'assets/img/cards/cardClubsK.png');

    this.load.image('cardDiamonds2', 'assets/img/cards/cardDiamonds2.png');
    this.load.image('cardDiamonds3', 'assets/img/cards/cardDiamonds3.png');
    this.load.image('cardDiamonds4', 'assets/img/cards/cardDiamonds4.png');
    this.load.image('cardDiamonds5', 'assets/img/cards/cardDiamonds5.png');
    this.load.image('cardDiamonds6', 'assets/img/cards/cardDiamonds6.png');
    this.load.image('cardDiamonds7', 'assets/img/cards/cardDiamonds7.png');
    this.load.image('cardDiamonds8', 'assets/img/cards/cardDiamonds8.png');
    this.load.image('cardDiamonds9', 'assets/img/cards/cardDiamonds9.png');
    this.load.image('cardDiamonds10', 'assets/img/cards/cardDiamonds10.png');
    this.load.image('cardDiamondsJ', 'assets/img/cards/cardDiamondsJ.png');
    this.load.image('cardDiamondsQ', 'assets/img/cards/cardDiamondsQ.png');
    this.load.image('cardDiamondsK', 'assets/img/cards/cardDiamondsK.png');

    this.load.image('cardHearts2', 'assets/img/cards/cardHearts2.png');
    this.load.image('cardHearts3', 'assets/img/cards/cardHearts3.png');
    this.load.image('cardHearts4', 'assets/img/cards/cardHearts4.png');
    this.load.image('cardHearts5', 'assets/img/cards/cardHearts5.png');
    this.load.image('cardHearts6', 'assets/img/cards/cardHearts6.png');
    this.load.image('cardHearts7', 'assets/img/cards/cardHearts7.png');
    this.load.image('cardHearts8', 'assets/img/cards/cardHearts8.png');
    this.load.image('cardHearts9', 'assets/img/cards/cardHearts9.png');
    this.load.image('cardHearts10', 'assets/img/cards/cardHearts10.png');
    this.load.image('cardHeartsJ', 'assets/img/cards/cardHeartsJ.png');
    this.load.image('cardHeartsQ', 'assets/img/cards/cardHeartsQ.png');
    this.load.image('cardHeartsK', 'assets/img/cards/cardHeartsK.png');

    this.load.image('cardSpades2', 'assets/img/cards/cardSpades2.png');
    this.load.image('cardSpades3', 'assets/img/cards/cardSpades3.png');
    this.load.image('cardSpades4', 'assets/img/cards/cardSpades4.png');
    this.load.image('cardSpades5', 'assets/img/cards/cardSpades5.png');
    this.load.image('cardSpades6', 'assets/img/cards/cardSpades6.png');
    this.load.image('cardSpades7', 'assets/img/cards/cardSpades7.png');
    this.load.image('cardSpades8', 'assets/img/cards/cardSpades8.png');
    this.load.image('cardSpades9', 'assets/img/cards/cardSpades9.png');
    this.load.image('cardSpades10', 'assets/img/cards/cardSpades10.png');
    this.load.image('cardSpadesJ', 'assets/img/cards/cardSpadesJ.png');
    this.load.image('cardSpadesQ', 'assets/img/cards/cardSpadesQ.png');
    this.load.image('cardSpadesK', 'assets/img/cards/cardSpadesK.png');

    this.load.audio('background', ['assets/sounds/background-bensound.mp3']);
    this.load.audio('cardPlace', ['assets/sounds/cardPlace1.ogg']);
    this.load.audio('cardSlide', ['assets/sounds/cardSlide1.ogg']);
    this.load.audio('dieShuffle', ['assets/sounds/dieShuffle1.ogg']);
    this.load.audio('dieThrow', ['assets/sounds/dieThrow2.ogg']);

    // this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
  },
  create: function() {
    this.game.cards = [];
    this.game.cards.back = 'card_back';
    var spades = [{value: 2, sprite: 'cardSpades2'}, {value: 3, sprite: 'cardSpades3'}, {value: 4, sprite: 'cardSpades4'}, {value: 5, sprite: 'cardSpades5'}, {value: 6, sprite: 'cardSpades6'}, {value: 7, sprite: 'cardSpades7'}, {value: 8, sprite: 'cardSpades8'}, {value: 9, sprite: 'cardSpades9'}, {value: 10, sprite: 'cardSpades10'}, {value: 11, sprite: 'cardSpadesJ'}, {value: 12, sprite: 'cardSpadesQ'}, {value: 13, sprite: 'cardSpadesK'}];
    var hearts = [{value: 2, sprite: 'cardHearts2'}, {value: 3, sprite: 'cardHearts3'}, {value: 4, sprite: 'cardHearts4'}, {value: 5, sprite: 'cardHearts5'}, {value: 6, sprite: 'cardHearts6'}, {value: 7, sprite: 'cardHearts7'}, {value: 8, sprite: 'cardHearts8'}, {value: 9, sprite: 'cardHearts9'}, {value: 10, sprite: 'cardHearts10'}, {value: 11, sprite: 'cardHeartsJ'}, {value: 12, sprite: 'cardHeartsQ'}, {value: 13, sprite: 'cardHeartsK'}];
    var clubs = [{value: 2, sprite: 'cardClubs2'}, {value: 3, sprite: 'cardClubs3'}, {value: 4, sprite: 'cardClubs4'}, {value: 5, sprite: 'cardClubs5'}, {value: 6, sprite: 'cardClubs6'}, {value: 7, sprite: 'cardClubs7'}, {value: 8, sprite: 'cardClubs8'}, {value: 9, sprite: 'cardClubs9'}, {value: 10, sprite: 'cardClubs10'}, {value: 11, sprite: 'cardClubsJ'}, {value: 12, sprite: 'cardClubsQ'}, {value: 13, sprite: 'cardClubsK'}];
    var diamonds = [{value: 2, sprite: 'cardDiamonds2'}, {value: 3, sprite: 'cardDiamonds3'}, {value: 4, sprite: 'cardDiamonds4'}, {value: 5, sprite: 'cardDiamonds5'}, {value: 6, sprite: 'cardDiamonds6'}, {value: 7, sprite: 'cardDiamonds7'}, {value: 8, sprite: 'cardDiamonds8'}, {value: 9, sprite: 'cardDiamonds9'}, {value: 10, sprite: 'cardDiamonds10'}, {value: 11, sprite: 'cardDiamondsJ'}, {value: 12, sprite: 'cardDiamondsQ'}, {value: 13, sprite: 'cardDiamondsK'}];

    this.game.cards.deck = spades.concat(hearts, clubs, diamonds);

    this.game.time.events.add(Phaser.Timer.SECOND, function() { this.state.start('Menu')}, this);
    // this.state.start('Menu');
  }
};
