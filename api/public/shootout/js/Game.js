var Shooter = Shooter || {};

Shooter.Game = function(){};

Shooter.Game.prototype = {
  preload: function() {
      this.game.time.advancedTiming = true;
    },
  create: function() {
    this.map = this.game.add.tilemap('scifi');
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.map.addTilesetImage('scifi_spritesheet', 'gameTiles');

    //create layers
    this.backgroundlayer = this.map.createLayer('background');
    this.blockedLayer = this.map.createLayer('blocked');
    this.blockedLayer.resizeWorld();
    this.map.setCollisionBetween(1, 5000, true, 'blocked');

    this.bulletTime = 0;
    this.HITS = 3;
    this.LIVES = 3;


    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(30, 'bullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 1);

    this.players = [];
    this.spawnPositions = [{x: 100, y: 300},{x: 300, y: 300}, {x: 200, y: 300}]

    this.initXentha();

    //sounds
    // this.coinSound = this.game.add.audio('coin');
    this.coinSound = this.game.add.audio('coin');
    this.hurtSound = this.game.add.audio('hurt');
    this.shotSound = this.game.add.audio('shot');
    // this.shotSound.volume = 0.3;
    // this.hurtSound.volume = 0.6;
    this.backgroundSound = this.game.add.audio('background');
    this.backgroundSound.loopFull(0.4);
  },
  findObjectsByType: function(type, map, layerName) {
    var result = new Array();
    map.objects[layerName].forEach(function(element){
      if(element.properties.type === type) {
        element.y -= map.tileHeight;
        result.push(element);
      }
    });
    return result;
  },
  createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);

      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
  },
  update: function() {
    //collision
    var me = this;
    for(var i = 0; i < this.players.length; i++) {

      var player = this.players[i];
      if (player.alive)
      {
        this.game.physics.arcade.collide(player, this.blockedLayer);
        me.game.physics.arcade.overlap(me.bullets, player, me.hit, null, me);

        var input = player.xentha.input[0];
        if(input) {
          if(input.id == 'left') {
            player.direction = 'left';
            if(input.pressed == true) {
              player.body.velocity.x = -200;
              player.loadTexture('playerLeft');
            } else {
              player.body.velocity.x = 0;
            }
            player.gun.anchor.setTo(.5, -.3);
            player.gun.scale.x = -1
          }
          if(input.id == 'right') {
            player.direction = 'right';
            if(input.pressed == true) {
              player.loadTexture('playerRight');
              player.body.velocity.x = 200;
            } else {
              player.body.velocity.x = 0;
            }
            player.gun.anchor.setTo(-.5, -.3);
            player.gun.scale.x = 1
          }
          if(input.id == 'up') {
            if(input.pressed == true) {
            } else {
            }
          }

          if(input.id == 'joystick') {
            if(input.pressed == true) {
              console.log(input);
            }
          }

          if(input.id == 'a') {
            if(input.pressed == true) {
              this.playerFire(player);
            } else {
            }
          }
          if(input.id == 'b') {
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
  respawn: function(player) {
    player.kill();
    var spawnPosition = this.spawnPositions[Math.floor((Math.random() * this.spawnPositions.length))];
    player.x = spawnPosition.x;
    player.y = spawnPosition.y;
    player.hits = this.HITS;
    player.loadTexture('player');
    player.revive();
  },
  playerFire: function(player) {
    //  To avoid them being allowed to fire too fast we set a time limit
    if (this.game.time.now > this.bulletTime)
    {
        //  Grab the first bullet we can from the pool
        var bullet = this.bullets.getFirstExists(false);
        bullet.checkWorldBounds = true;

        if (bullet && !(player.body.velocity.x == 0 && player.body.velocity.y == 0)) {
            this.shotSound.play();
            //  And fire it
            bullet["firedBy"] = player.xentha.id;
            bullet.reset((player.x + player.width / 2) + player.gun.anchor.x ,player.y + player.height);

            if (player.direction == 'left') {
              bullet.body.velocity.x = -400;
            } else if(player.direction == 'right') {
              bullet.body.velocity.x = 400;
            }
            this.bulletTime = this.game.time.now + 200;
        }
    }
  },
  resetBullet: function(bullet) {
      //  Called if the bullet goes out of the screen
      bullet.kill();
  },
  hit: function(player, bullet) {
    if(bullet.firedBy != player.xentha.id) {
      this.hurtSound.play();
      var hurtVelocity = bullet.body.velocity.x;
      bullet.kill();
      me = this;

      if(player.hits < 1) {
        player.loadTexture('playerDead');
        player.lives -= 1;

        if(player.lives < 1) {
          player.kill();
          this.checkIfEndGame();
        } else {
          this.game.time.events.add(Phaser.Timer.SECOND * 4, this.respawn, this, player);
        }
      } else {
        player.loadTexture('playerHurt');
        // setTimeout()
        player.body.velocity.x = player.body.velocity.x + hurtVelocity;
        player.hits -= 1;
        this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.resetVelocity, this, player);
      }
    }

  },
  resetVelocity: function(player) {
    player.body.velocity.x = 0;
    player.loadTexture('player');
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

    var me = this;

    XENTHA.on("playerJoined", function(data) {
      var player = me.game.add.sprite(100, 200, 'player');

      player.gun = me.game.add.sprite(0, 0, 'gun');
      player.addChild(player.gun);
      player.gun.anchor.setTo(-.5, -.3);

      me.game.physics.arcade.enable(player);
      player.body.collideWorldBounds=true;
      player.body.gravity.y = 1000;

      // set default lives.
      player.lives = me.LIVES;
      player.hits = me.HITS;
      player.xentha = data.player;
      me.players.push(player);
    });

    XENTHA.on("playerLeft", function(data) {
      console.log('player left.. ');
      var index = me.players.map(function(player) {
        return player.xentha.id;
      }).indexOf(data.player.id);

      me.players[index].destroy();
      me.players.splice(index);
    });

    XENTHA.on("onInput", function(event) {
      for(var i = 0; i < me.players.length; i++){
        if(me.players[i].xentha.id == event.player) {
          me.players[i].xentha.input.push({id: event.data.id, pressed: event.data.pressed});
        }
      }
    });
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
  render: function() {
  }
};
