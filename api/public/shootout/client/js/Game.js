var ShooterClient = ShooterClient || {};

ShooterClient.Game = function(){};

ShooterClient.Game.prototype = {
  preload: function() {
  },
  create: function() {
    this.buildControllerLayout();
  },
  buildControllerLayout: function() {
    this.game.stage.addChild(createButton('a', window.innerWidth - 250, window.innerHeight - 100,80,80, 'button-a.png', null, {
      mousedown: function() {
        XENTHA.input({id: this.XENTHA_ID, pressed: true});
      },

      mousemove: function() {

      },

      mouseup: function() {
        XENTHA.input({id: this.XENTHA_ID, pressed: false});
      }
    }));
    this.game.stage.addChild(createButton('b', window.innerWidth - 150,window.innerHeight - 100,80,80, 'button-b.png', null, {
      mousedown: function() {
        XENTHA.input({id: this.XENTHA_ID, pressed: true});
      },

      mousemove: function() {

      },

      mouseup: function() {
        XENTHA.input({id: this.XENTHA_ID, pressed: false});
      }
    }));

  this.game.stage.addChild(createButton('up', 70,window.innerHeight - 150,50,50, 'button-up.png', null, {
      mousedown: function() {
        XENTHA.input({id: this.XENTHA_ID, pressed: true});
      },

      mousemove: function() {

      },

      mouseup: function() {
        XENTHA.input({id: this.XENTHA_ID, pressed: false});
      }
    }));
    this.game.stage.addChild(createButton('down', 70,window.innerHeight - 50,50,50, 'button-down.png', null, {
      mousedown: function() {
        XENTHA.input({id: this.XENTHA_ID, pressed: true});
      },

      mousemove: function() {

      },

      mouseup: function() {
        XENTHA.input({id: this.XENTHA_ID, pressed: false});
      }
    }));
    this.game.stage.addChild(createButton('left', 20,window.innerHeight - 100,50,50, 'button-left.png', null, {
      mousedown: function() {
        XENTHA.input({id: this.XENTHA_ID, pressed: true});
      },

      mousemove: function() {

      },

      mouseup: function() {
        XENTHA.input({id: this.XENTHA_ID, pressed: false});
      }
    }));
  this.game.stage.addChild(createButton('right', 120,window.innerHeight - 100,50,50, 'button-right.png', null, {
      mousedown: function() {
        XENTHA.input({id: this.XENTHA_ID, pressed: true});
      },

      mousemove: function() {

      },

      mouseup: function() {
        XENTHA.input({id: this.XENTHA_ID, pressed: false});
      }
    }));
  },
  createButton: function(id, x,y,width,height,image, text, events) {
    var events = events || {};
  	var texture = PIXI.Texture.fromImage("img/" + image);
    var button = new PIXI.Sprite(texture);

    // if(text) {
    //   button.addChild(new PIXI.Text(text, {font: '20px Arial', fill: '#fff'}));
    // }

    button.interactive = true;
    button.buttonMode = true;
    button.XENTHA_ID = id;

    if(text) {
      var text = new PIXI.Text(text, {font: '20px Arial', fill: '#fff'});
      text.x = button.width / 2;
      text.y = button.height / 2;
      button.addChild(text);
    }

    button.texture.baseTexture.on('loaded', function(){
      button.scale.x = width / button.width;
      button.scale.y = height / button.height;
    });

    button.on('mousedown', events.mousedown)
    button.on('mouseup', events.mouseup)
    button.on('mouseupoutside', events.mouseup)
    button.on('touchstart', events.mousedown)
    button.on('touchend', events.mouseup)
    button.on('touchendoutside', events.mouseup);
    button.on('mousemove', events.mousemove);

    // move the sprite to its designated position
    button.position.x = x;
    button.position.y = y;
    return button;
  }
};
