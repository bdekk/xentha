var Shooter = Shooter || {};

Shooter.game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, '');

Shooter.game.state.add('Boot', Shooter.Boot);
Shooter.game.state.add('Preload', Shooter.Preload);
Shooter.game.state.add('Game', Shooter.Game);

Shooter.game.state.start('Boot');
