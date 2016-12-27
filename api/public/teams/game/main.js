var Teams = Teams || {};

Teams.game = new Phaser.Game('100%','100%', Phaser.AUTO, '');

Teams.game.state.add('Boot', Teams.Boot);
Teams.game.state.add('Game', Teams.Game);
Teams.game.state.add('Preload', Teams.Preload);

Teams.game.state.start('Boot');
