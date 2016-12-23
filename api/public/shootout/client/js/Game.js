var ShooterClient = ShooterClient || {};

ShooterClient.Game = function(){};

ShooterClient.Game.prototype = {
  preload: function() {
  },
  create: function() {
    this.buildControllerLayout();
  },
  buildControllerLayout: function() {
    this.game.stage.addChild(this.createButton('a', window.innerWidth - 250, window.innerHeight - 100,80,80, 'button-a.png', null, {
      mousedown: function() {
        XENTHA.send('player.input', {id: this.XENTHA_ID, pressed: true});
      },

      mousemove: function() {

      },

      mouseup: function() {
        XENTHA.send('player.input', {id: this.XENTHA_ID, pressed: false});
      }
    }));
    this.game.stage.addChild(this.createButton('b', window.innerWidth - 150,window.innerHeight - 100,80,80, 'button-b.png', null, {
      mousedown: function() {
        XENTHA.send('player.input', {id: this.XENTHA_ID, pressed: true});
      },

      mousemove: function() {

      },

      mouseup: function() {
        XENTHA.send('player.input', {id: this.XENTHA_ID, pressed: false});
      }
    }));

  this.game.stage.addChild(this.createButton('up', 70,window.innerHeight - 150,50,50, 'button-up.png', null, {
      mousedown: function() {
        XENTHA.send('player.input', {id: this.XENTHA_ID, pressed: true});
      },

      mousemove: function() {

      },

      mouseup: function() {
        XENTHA.send('player.input', {id: this.XENTHA_ID, pressed: false});
      }
    }));
    this.game.stage.addChild(this.createButton('down', 70,window.innerHeight - 50,50,50, 'button-down.png', null, {
      mousedown: function() {
        XENTHA.send('player.input', {id: this.XENTHA_ID, pressed: true});
      },

      mousemove: function() {

      },

      mouseup: function() {
        XENTHA.send('player.input', {id: this.XENTHA_ID, pressed: false});
      }
    }));
    this.game.stage.addChild(this.createButton('left', 20,window.innerHeight - 100,50,50, 'button-left.png', null, {
      mousedown: function() {
        XENTHA.send('player.input', {id: this.XENTHA_ID, pressed: true});
      },

      mousemove: function() {

      },

      mouseup: function() {
        XENTHA.send('player.input', {id: this.XENTHA_ID, pressed: false});
      }
    }));
  this.game.stage.addChild(this.createButton('right', 120,window.innerHeight - 100,50,50, 'button-right.png', null, {
      mousedown: function() {
        XENTHA.send('player.input', {id: this.XENTHA_ID, pressed: true});
      },

      mousemove: function() {

      },

      mouseup: function() {
        XENTHA.send('player.input', {id: this.XENTHA_ID, pressed: false});
      }
    }));
  },
  createButton: function(id, x, y, width, height, image, text, events) {
    var events = events || {};
    var button = this.game.add.button(x, y, id, null, this);

    button.interactive = true;
    button.buttonMode = true;
    button.XENTHA_ID = id;

    if(text) {
      var text = this.game.add.text(button.width / 2, button.height / 2, text, {font: '20px Arial', fill: '#fff'});
    }

    button.scale.setTo(width / button.width);

    // button.texture.baseTexture.on('loaded', function(){
    //   button.scale.x = width / button.width;
    //   button.scale.y = height / button.height;
    // });

    button.onInputDown.add(events.mousedown, this);
    button.onInputUp.add(events.mouseup, this);

    // move the sprite to its designated position
    button.position.x = x;
    button.position.y = y;
    return button;
  }
};
