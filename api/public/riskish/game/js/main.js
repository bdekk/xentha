var Riskish = Riskish || {};

Riskish.game = new Phaser.Game(800,600, Phaser.AUTO, '');

Riskish.game.state.add('Boot', Riskish.Boot);
Riskish.game.state.add('Preload', Riskish.Preload);
Riskish.game.state.add('Menu', Riskish.Menu);
Riskish.game.state.add('Game', Riskish.Game);

Riskish.game.state.start('Boot');
