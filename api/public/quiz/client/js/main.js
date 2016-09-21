var QuizClient = QuizClient || {};

QuizClient.game = new Phaser.Game(800,600, Phaser.AUTO, '');

QuizClient.game.state.add('Boot', QuizClient.Boot);
QuizClient.game.state.add('Preload', QuizClient.Preload);
QuizClient.game.state.add('Menu', QuizClient.Menu);
QuizClient.game.state.add('Game', QuizClient.Game);

QuizClient.game.state.start('Boot');
