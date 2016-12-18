var Quiz = Quiz || {};

Quiz.game = new Phaser.Game(800,600, Phaser.AUTO, '');

Quiz.game.state.add('Boot', Quiz.Boot);
Quiz.game.state.add('Preload', Quiz.Preload);
Quiz.game.state.add('Menu', Quiz.Menu);
Quiz.game.state.add('Game', Quiz.Game);
Quiz.game.state.add('Highscore', Quiz.Highscore);

Quiz.game.state.start('Boot');
