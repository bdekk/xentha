var RiskishClient = QuizClient || {};

RiskishClient.game = new Phaser.Game(800,600, Phaser.AUTO, '');

RiskishClient.game.state.add('Boot', RiskishClient.Boot);
RiskishClient.game.state.add('Preload', RiskishClient.Preload);
RiskishClient.game.state.add('Menu', RiskishClient.Menu);
RiskishClient.game.state.add('Game', RiskishClient.Game);
RiskishClient.game.state.add('Highscore', RiskishClient.Highscore);

RiskishClient.game.state.start('Boot');
