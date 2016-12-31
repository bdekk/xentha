var TeamsClient = TeamsClient || {};

TeamsClient.game = new Phaser.Game(800,600, Phaser.AUTO, '');

TeamsClient.game.state.add('Boot', TeamsClient.Boot);
TeamsClient.game.state.add('Game', TeamsClient.Game);
TeamsClient.game.state.add('Preload', TeamsClient.Preload);

TeamsClient.game.state.start('Boot');
