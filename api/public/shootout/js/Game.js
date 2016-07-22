var Shooter = Shooter || {};

Shooter.Game = function(){};

Shooter.Game.prototype = {
  preload: function() {
      this.game.time.advancedTiming = true;
    },
  create: function() {
    this.map = this.game.add.tilemap('level3');

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('tiles_spritesheet', 'gameTiles');

    //create layers
    this.backgroundlayer = this.map.createLayer('background');
    this.blockedLayer = this.map.createLayer('blocked');

    //collision on blockedLayer
    this.map.setCollisionBetween(1, 5000, true, 'blocked');

    //resizes the game world to match the layer dimensions
    this.backgroundlayer.resizeWorld();

    // //create coins
    // this.createCoins();

    //create player
    // this.player = this.game.add.sprite(100, 300, 'player');

    //enable physics on the player
    // this.game.physics.arcade.enable(this.player);

    // //player gravity
    // this.player.body.gravity.y = 1000;
    this.bulletTime = 0;
    this.lives = 3;


    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(30, 'bullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 1);

    var playerDuckImg = this.game.cache.getImage('playerDuck');
    var duckedDimensions = {width: playerDuckImg.width, height: playerDuckImg.height};

    this.players = [];

    this.initXentha();

    //sounds
    // this.coinSound = this.game.add.audio('coin');
  },

 //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType: function(type, map, layerName) {
    var result = new Array();
    map.objects[layerName].forEach(function(element){
      if(element.properties.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust
        //also keep in mind that some images could be of different size as the tile size
        //so they might not be placed in the exact position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }
    });
    return result;
  },
  //create a sprite from an object
  createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);

      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
  },
  update: function() {
    //collision

    for(var i = 0; i < this.players.length; i++) {

      var player = this.players[i];
      if (player.alive)
      {

        this.game.physics.arcade.collide(player, this.blockedLayer);

        this.getOtherPlayers(player).forEach(function(player, index) {
          this.game.physics.arcade.overlap(this.bullets, player, this.hit, null, this);
        });

        var input = player.xentha.input[0];
        if(input) {
          if(input.id == 'left') {
            if(input.pressed == true) {
              player.body.velocity.x = -200;
              player.loadTexture('playerLeft');
            } else {
              player.body.velocity.x = 0;
              player.loadTexture('player');
            }
          }
          if(input.id == 'right') {
            if(input.pressed == true) {
              player.loadTexture('playerRight');
              player.body.velocity.x = 200;
            } else {
              player.body.velocity.x = 0;
              player.loadTexture('player');
            }
          }
          if(input.id == 'down') {
            if(input.pressed == true) {
              this.playerDuck(player);
            } else {
            }
          }
          if(input.id == 'up') {
            if(input.pressed == true) {
            } else {
            }
          }

          if(input.id == 'a') {
            if(input.pressed == true) {
              this.playerFire(player);
            } else {
            }
          } else if(input.id == 'b') {
            if(input.pressed == true) {
              this.playerJump(player);
            }
          }
          player.xentha.input.shift();
        }
      }
    }
  },
  getOtherPlayers: function(player) {
    var otherPlayers = [];
    for(var i =0; i < this.players.length; i++) {
      if(this.players[i].xentha.id !== player.xentha.id) {
        otherPlayers.push(this.players[i]);
      }
    }
    return otherPlayers;
  },
  playerFire: function(player) {
    //  To avoid them being allowed to fire too fast we set a time limit
    if (this.game.time.now > this.bulletTime)
    {
        //  Grab the first bullet we can from the pool
        var bullet = this.bullets.getFirstExists(false);

        if (bullet && !(player.body.velocity.x == 0 && player.body.velocity.y == 0)) {
            //  And fire it
            bullet.reset(player.x , player.y + ((player.height / 3) * 2));

            if (player.body.velocity.y < 0) {
              bullet.body.velocity.y = player.body.velocity.y - 100;
            } else if(player.body.velocity.y > 0) {
              bullet.body.velocity.y = player.body.velocity.y + 100;
            }

            if (player.body.velocity.x < 0) {
              bullet.body.velocity.x = player.body.velocity.x - 100;
            } else if(player.body.velocity.x > 0) {
              bullet.body.velocity.x = player.body.velocity.x + 100;
            }
            // bullet.body.velocity.x = (player.body.velocity.x < 0) ? player.body.velocity.x - 100 : player.body.velocity.X + 100;
            this.bulletTime = this.game.time.now + 200;
        }
    }
  },
  resetBullet: function(bullet) {
      //  Called if the bullet goes out of the screen
      bullet.kill();
  },
  hit: function(player,bullet) {
      bullet.kill();

      if(player.lives < 1) {
        player.kill();
        checkIfEndGame();
      } else {
        player.lives -= 1;
      }
  },
  collect: function(player, collectable) {
    //play audio
    this.coinSound.play();

    //remove sprite
    collectable.destroy();
  },
  initXentha: function() {
    if(!XENTHA) {
      console.err('could not find xentha :(');
      return;
    }

    XENTHA.connect();

    var me = this;
    XENTHA.playerJoined = function(data) {
      XENTHA.setLayout(XENTHA.layouts.CONTROLLER);
      // data.players.forEach(function(xPlayer, index) {
      var player = me.game.add.sprite(100, 300, 'player');
      me.game.physics.arcade.enable(player);
      player.body.gravity.y = 1000;

      // set default lives.
      player.lives = this.lives;
      player.xentha = data.player;
      me.players.push(player);
    }

    XENTHA.playerLeft = function(data) {
      console.log('player left.. ');
    }

    XENTHA.onInput = function(data) {
      for(var i = 0; i < me.players.length; i++){
        if(me.players[i].xentha.id == data.player) {
          me.players[i].xentha.input.push({id: data.input.id, pressed: data.input.pressed});
        }
      }
    }
  },
  //create coins
  createCoins: function() {
    this.coins = this.game.add.group();
    this.coins.enableBody = true;
    var result = this.findObjectsByType('coin', this.map, 'objectsLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.coins);
    }, this);
  },
  checkIfEndGame: function() {
    // check if end game.
    var playersAlive = this.players.length;
    var winner = null;
    for(var i = 0; i < this.players.length; i++) {
      if(!this.players[i].alive) {
        playersAlive -= 1;
      } else {
        winner = this.players[i];
      }
    }
    if(playersAlive < 2) {
      this.endGame(winner);
    } else {
      winner = null;
    }
  },
  endGame: function() {
    this.game.state.start('Game');
  },
  playerJump: function(player) {
    if(player.body.blocked.down) {
      player.loadTexture('playerJump');
      player.body.velocity.y -= 700;
    }
  },
  playerDuck: function(player) {
      //change image and update the body size for the physics engine
      player.loadTexture('playerDuck');
      // player.body.setSize(duckedDimensions.width, duckedDimensions.height);

      //we use this to keep track whether it's ducked or not
      player.isDucked = true;
  },
  render: function()
    {
        // this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");
        // this.game.debug.bodyInfo(this.player, 0, 80);
    }
};
