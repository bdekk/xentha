var ShooterClient = ShooterClient || {};

ShooterClient.game = new Phaser.Game('100%','100%', Phaser.AUTO, '');

ShooterClient.game.state.add('Boot', ShooterClient.Boot);
ShooterClient.game.state.add('Preload', ShooterClient.Preload);
ShooterClient.game.state.add('Game', ShooterClient.Game);

ShooterClient.game.state.start('Boot');
