var Teams = Teams || {};

Teams.Game = function(){};

Teams.Game.prototype = {
  preload: function() {
      this.game.time.advancedTiming = true;

      this.players = [];
    },
  create: function() {
    this.map = this.game.add.tilemap('level1');
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.map.addTilesetImage('towerDefense_tilesheet', 'towerDefense_tilesheet', 64, 64);
    this.map.addTilesetImage('medieval_tilesheet', 'medieval_tilesheet', 64, 64);
    this.map.addTilesetImage('scifi_tilesheet', 'scifi_tilesheet', 64, 64);

    //create layers
    this.backgroundlayer = this.map.createLayer('backgroundLayer'); // just green
    this.propsLayer = this.map.createLayer('backgroundLayer2'); //paths , water , sand
    this.blockedLayer = this.map.createLayer('blockedLayer'); // blocking obstacles.
    this.obstacleLayer = this.map.createLayer('obstacleBackground'); // action triggers.
    this.backgroundlayer.resizeWorld();
    this.map.setCollisionBetween(1, 5000, true, 'blockedLayer');


    this.player = this.game.add.sprite(100, 300, 'player');
    this.player.scale.setTo(64/this.player.width * 0.5, 64/this.player.height * 0.5);
    // player.body.velocity.x = 200;

    this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    XENTHA.on('playerJoined', function(event) {
          console.log('player joined', event);
    }.bind(this));

    XENTHA.on('playerLeft', function(event) {
        console.log('player left', event);
    }.bind(this));

    XENTHA.on('playerMoveLeft', function(event) {
      if(event.data.pressed) {
        this.player.x-=2;
      }
    }.bind(this));


    XENTHA.on('playerMoveRight', function(event) {
      if(event.data.pressed) {
        this.player.x+=2;
      }
    }.bind(this));


    XENTHA.on('playerMoveUp', function(event) {
        if(event.data.pressed) {
          this.player.y+=2;
        }
    }.bind(this));


    XENTHA.on('playerMoveDown', function(event) {
        if(event.data.pressed) {
          this.player.y-=2;
        }
    }.bind(this));


    XENTHA.on('playerA', function(event) {
        console.log('player playerA', event);

    });

    XENTHA.on('playerB', function(event) {
        console.log('player playerB', event);

    });
  },
  update: function() {


    if (this.upKey.isDown)
    {
        this.player.y-=2;
    }
    else if (this.downKey.isDown)
    {
        this.player.y+=2;
    }

    if (this.leftKey.isDown)
    {
        this.player.x-=2;
    }
    else if (this.rightKey.isDown)
    {
        this.player.x+=2;
    }

  }
};
