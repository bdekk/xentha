var Bussen = Bussen || {};

Bussen.game = new Phaser.Game(800,600, Phaser.AUTO, '');

Bussen.game.state.add('Boot', Bussen.Boot);
Bussen.game.state.add('Preload', Bussen.Preload);
Bussen.game.state.add('Menu', Bussen.Menu);
Bussen.game.state.add('Game', Bussen.Game);

Bussen.game.state.start('Boot');
