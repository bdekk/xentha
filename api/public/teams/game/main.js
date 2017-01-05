var Teams = Teams || {};

Teams.game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, 'gameArea');

Teams.game.state.add('Boot', Teams.Boot);
Teams.game.state.add('Game', Teams.Game);
Teams.game.state.add('Preload', Teams.Preload);

Teams.game.state.start('Boot');
