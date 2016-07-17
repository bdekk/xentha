
XENTHA.callbacks = [
  {'game.end': 'onGameEnd'},
  {'game.start': 'onGameStart'},
  {'game.restart': 'onGameRestart'}
];

XENTHA.connect();

// XENTHA.onGameEnd = function(bla) {
//
// }

var createRoom = function() {
  var roomName = document.getElementById('roomName').value;
  var name = document.getElementById('name').value;
  if(roomName && name) {
    XENTHA.socket.emit('createRoom', {name: 'Brams Room', });
  } else {
      document.getElementById('error').textContent = 'Please enter roomName and name.';
  }
}

var joinRoom = function() {
  var roomCode = document.getElementById('roomCode').value;
  if(roomCode) {
    XENTHA.socket.emit('joinRoom', {roomCode: roomCode});
  } else {
      document.getElementById('error').textContent = 'Please enter roomCode.';
  }
}

XENTHA.roomCreated = function(data) {
  console.log(data);
  document.getElementById('roomCreatedText').innerHTML = 'Go to xentha.com and enter roomcode: <strong>' + data.roomCode + '</strong>';
    // var name = document.getElementById('name').value;
    // if(name) {
    //   XENTHA.socket.emit('joinRoom', {roomCode: data.roomCode, name: name});
    // }
    // form.style.display = 'none';
    // controller.style.display = 'inline';
}

XENTHA.roomJoined = function(data) {
    // present lobby or gamepad.
    form.style.display = 'none';
    controller.style.display = 'inline';
    // renderer.backgroundColorString = data.player.color;

};

XENTHA.buildLayout = function(layout) {
  for (var i = stage.children.length - 1; i >= 0; i--) {	stage.removeChild(stage.children[i]);};
  if(layout == 'controller') {
    buildControllerLayout();
  } else {
    for(var i =0; i < layout.length; i++) {
      if(layout[i].type == 'button') {
        stage.addChild(createButton(layout[i].id, layout[i].x, layout[i].y,layout[i].width,layout[i].height, 'button-a.png', null,  {
          mousedown: function() {
            XENTHA.input({id: this.XENTHA_ID, pressed: true});
          },
          mouseup: function() {
              XENTHA.input({id: this.XENTHA_ID, pressed: false});
          }

        }));
      } else if(layout[i].type == 'input') {

      } else if(layout[i].type == 'text') {
        textOptions = {};
        if(!layout[i].size) layout[i].size = 50;
        textOptions.font = layout[i].size + "px Arial";
        textOptions.fill = layout[i].color || "#fff";
        var text = new PIXI.Text(layout[i].value, textOptions);
        text.x = layout[i].x;
        text.y = layout[i].y;
        stage.addChild(text);
      }
    }
  }
}

XENTHA.addLayout = function(layout) {
  console.log(layout);
  for(var i =0; i < layout.length; i++) {
    if(layout[i].type == 'button') {
      var image = layout[i].image || 'button-square.png';
      stage.addChild(createButton(layout[i].id, layout[i].x, layout[i].y,layout[i].width,layout[i].height, image, layout[i].text,  {
        mousedown: function() {
          XENTHA.input({id: this.XENTHA_ID, pressed: true});
        },
        mouseup: function() {
            XENTHA.input({id: this.XENTHA_ID, pressed: false});
        }

      }));
    } else if(layout[i].type == 'input') {

    } else if(layout[i].type == 'text') {
      textOptions = {};
      if(!layout[i].size) layout[i].size = 50;
      textOptions.font = layout[i].size + "px Arial";
      textOptions.fill = layout[i].color || "#fff";
      var text = new PIXI.Text(layout[i].value, textOptions);
      text.x = layout[i].x;
      text.y = layout[i].y;
      stage.addChild(text);
    }
  }
}

XENTHA.error = function(data) {
    document.getElementById('error').textContent = data;
}

var form = document.getElementById('preform');
var controller = document.getElementById("controller");
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { transparent: true });
// var loader = new PIXI.AssetLoader([  "img/button-a.png",  "img/button-b.png",  "img/button-button-down.png", "img/button-up.png"]); loader.onComplete = setup;loader.load();
var stage = new PIXI.Container();
requestAnimationFrame( animate );


// add it to the stage


if(controller && form) {
  if(!XENTHA.roomCode) {
    controller.style.display = 'none';
  } else {
    form.style.display = 'none';
  }
  controller.appendChild(renderer.view);
  renderer.view.style.position = "absolute";
	renderer.view.style.top = "0px";
	renderer.view.style.left = "0px";
} else {
  console.error('Could not find element with id controller and preform.');
}


  // controller.style.display = 'inline';

function buildControllerLayout() {
  stage.addChild(createButton('a', window.innerWidth - 250, window.innerHeight - 100,80,80, 'button-a.png', null, {
    mousedown: function() {
      console.log(this.XENTHA_ID);
      XENTHA.input({id: this.XENTHA_ID, pressed: true});
    },

    mousemove: function() {

    },

    mouseup: function() {
      XENTHA.input({id: this.XENTHA_ID, pressed: false});
    }
  }));
  stage.addChild(createButton('b', window.innerWidth - 150,window.innerHeight - 100,80,80, 'button-b.png', null, {
    mousedown: function() {
      XENTHA.input({id: this.XENTHA_ID, pressed: true});
    },

    mousemove: function() {

    },

    mouseup: function() {
      XENTHA.input({id: this.XENTHA_ID, pressed: false});
    }
  }));

stage.addChild(createButton('up', 70,window.innerHeight - 150,50,50, 'button-up.png', null, {
    mousedown: function() {
      XENTHA.input({id: this.XENTHA_ID, pressed: true});
    },

    mousemove: function() {

    },

    mouseup: function() {
      XENTHA.input({id: this.XENTHA_ID, pressed: false});
    }
  }));
  stage.addChild(createButton('down', 70,window.innerHeight - 50,50,50, 'button-down.png', null, {
    mousedown: function() {
      XENTHA.input({id: this.XENTHA_ID, pressed: true});
    },

    mousemove: function() {

    },

    mouseup: function() {
      XENTHA.input({id: this.XENTHA_ID, pressed: false});
    }
  }));
  stage.addChild(createButton('left', 20,window.innerHeight - 100,50,50, 'button-left.png', null, {
    mousedown: function() {
      XENTHA.input({id: this.XENTHA_ID, pressed: true});
    },

    mousemove: function() {

    },

    mouseup: function() {
      XENTHA.input({id: this.XENTHA_ID, pressed: false});
    }
  }));
  stage.addChild(createButton('right', 120,window.innerHeight - 100,50,50, 'button-right.png', null, {
    mousedown: function() {
      XENTHA.input({id: this.XENTHA_ID, pressed: true});
    },

    mousemove: function() {

    },

    mouseup: function() {
      XENTHA.input({id: this.XENTHA_ID, pressed: false});
    }
  }));
}

function animate() {

    requestAnimationFrame( animate );
    renderer.render(stage);
}


function createButton(id, x,y,width,height,image, text, events) {
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

  button.mousedown = events.mousedown;
  button.touchstart = events.mousedown;
  button.mouseup = events.mouseup;
  button.touchend = events.touchend;
  button.mousemove = events.mousemove;

  // move the sprite to its designated position
  button.position.x = x;
  button.position.y = y;
  return button;
}
