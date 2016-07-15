XENTHA.connect();

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
  var name = document.getElementById('name').value;
  var roomCode = document.getElementById('roomCode').value;
  if(name && roomCode) {
    XENTHA.socket.emit('joinRoom', {roomCode: roomCode, name: name});
  } else {
      document.getElementById('error').textContent = 'Please enter name and roomCode.';
  }
}

XENTHA.roomCreated = function(data) {
  console.log(data);
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
  for(var i =0; i < layout.length; i++) {
    if(layout[i].type == 'button') {
      stage.addChild(createButton(layout[i].id, layout[i].x, layout[i].y,layout[i].width,layout[i].height,'button-a.png',  {
        mousedown: function() {
          XENTHA.input({id: this.XENTHA_ID, pressed: true});
        },
        mouseup: function() {
            XENTHA.input({id: this.XENTHA_ID, pressed: false});
        }

      }));
    } else if(layout[i].type == 'input') {

    }
  }
}

XENTHA.error = function(data) {
    document.getElementById('error').textContent = data;
}

var form = document.getElementById('preform');
var controller = document.getElementById("controller");
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { transparent: false });
// var loader = new PIXI.AssetLoader([  "img/button-a.png",  "img/button-b.png",  "img/button-button-down.png", "img/button-up.png"]); loader.onComplete = setup;loader.load();
var stage = new PIXI.Container();
requestAnimationFrame( animate );


// add it to the stage
stage.addChild(createButton(0, window.innerWidth - 250, window.innerHeight - 100,80,80, 'button-a.png', {
  mousedown: function() {
    XENTHA.buttonClick();
  },

  mousemove: function() {

  },

  mouseup: function() {

  }
}));
stage.addChild(createButton(1, window.innerWidth - 150,window.innerHeight - 100,80,80, 'button-b.png'));

stage.addChild(createButton(2, 70,window.innerHeight - 150,50,50, 'button-up.png'));
stage.addChild(createButton(3, 70,window.innerHeight - 50,50,50, 'button-down.png'));
stage.addChild(createButton(4, 20,window.innerHeight - 100,50,50, 'button-left.png'));
stage.addChild(createButton(5, 120,window.innerHeight - 100,50,50, 'button-right.png'));

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

function animate() {

    requestAnimationFrame( animate );
    renderer.render(stage);
}


function createButton(id, x,y,width,height,image, events) {
  var events = events || {};
	var texture = PIXI.Texture.fromImage("img/" + image);
  var button = new PIXI.Sprite(texture);
  button.interactive = true;
  button.buttonMode = true;
  button.XENTHA_ID = id;

  // button.anchor.x = width/2;
  // button.anchor.y = height/2;
  button.texture.baseTexture.on('loaded', function(){
    button.scale.x = width / button.width;
    button.scale.y = height / button.height;
  });

  button.mousedown = events.mousedown;
  button.touchstart = events.touchstart;
  button.mouseup = events.mouseup;
  button.mousemove = events.mousemove;

  // move the sprite to its designated position
  button.position.x = x;
  button.position.y = y;
  return button;
}
