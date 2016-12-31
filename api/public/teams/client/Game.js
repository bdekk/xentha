var TeamsClient = TeamsClient || {};

TeamsClient.Game = function(){};

TeamsClient.Game.prototype = {
  preload: function() {
  },
  create: function() {
    this.createControls();

  },
  update: function() {
    // if(window.innerHeight > window.innerWidth) {
    //   this.game.add.text(70, 70, "Please turn your device to landscape", {font: '20px Arial', fill: '#fff'});
    // } else {
    // }
  },
  createControls: function() {
    this.game.world.removeAll();
    this.game.stage.addChild(this.createButton('a', this.game.width - 250, this.game.height - 100,80,80, null, {
      mousedown: function() {
        XENTHA.send('player.a', {pressed: true});
      },

      mousemove: function() {

      },

      mouseup: function() {
        XENTHA.send('player.a', {pressed: false});
      }
    }));
    this.game.stage.addChild(this.createButton('b', this.game.width - 150, this.game.height - 100,80,80, null, {
      mousedown: function() {
        XENTHA.send('player.b', {pressed: true});
      },

      mousemove: function() {

      },

      mouseup: function() {
        XENTHA.send('player.b', {pressed: false});
      }
    }));

    this.game.stage.addChild(this.createButton('up', 70,this.game.height - 150,50,50, null, {
      mousedown: function() {
        XENTHA.send('player.move.up', {pressed: true});
      },

      mousemove: function() {

      },

      mouseup: function() {
        XENTHA.send('player.move.up', {pressed: false});
      }
    }));
    this.game.stage.addChild(this.createButton('down', 70,this.game.height - 50,50,50, null, {
      mousedown: function() {
        XENTHA.send('player.move.down', {pressed: true});
      },

      mousemove: function() {

      },

      mouseup: function() {
        XENTHA.send('player.move.down', {pressed: false});
      }
    }));
    this.game.stage.addChild(this.createButton('left', 20,this.game.height - 100,50,50, null, {
      mousedown: function() {
        XENTHA.send('player.move.left', {pressed: true});
      },

      mousemove: function() {

      },

      mouseup: function() {
        XENTHA.send('player.move.left', {pressed: false});
      }
    }));
    this.game.stage.addChild(this.createButton('right', 120,this.game.height - 100,50,50, null, {
      mousedown: function() {
        XENTHA.send('player.move.right', {pressed: true});
      },

      mousemove: function() {

      },

      mouseup: function() {
        XENTHA.send('player.move.right', {pressed: false});
      }
    }));
  },
  createButton: function(id, x, y, width, height, text, events) {
    var events = events || {};
    var button = this.game.add.button(x, y, id, null, this);

    button.interactive = true;
    button.buttonMode = true;
    button.XENTHA_ID = id;

    if(text) {
      var text = this.game.add.text(button.width / 2, button.height / 2, text, {font: '20px Arial', fill: '#fff'});
    }

    button.scale.setTo(width / button.width);

    button.onInputDown.add(events.mousedown, this);
    button.onInputUp.add(events.mouseup, this);

    // move the sprite to its designated position
    button.position.x = x;
    button.position.y = y;
    return button;
  }
};
