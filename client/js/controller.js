function Controller (options) {
  this.options = options;

  this.user = {};
  this.data = {};

  this.$keypadDisplay = $('#display > span');
  this.$home = $('#home');
  this.$controller = $('#controller');
  this.$game = $('#game');
  this.$menu = $('#menu');

  this.$notification = $('#errorBar');

  // this.socket = null;
  // this.ws = "ws://192.168.2.5:3000"
  // this.connected = false;

  this._connect();
  //
  // this.callbacks = [
  //   'player.join'
  // ];
}

Controller.prototype._connect = function() {
  // this.socket = new WebSocket(this.ws);
  XENTHA.callbacks["client.joined"] = 'roomJoined';
  XENTHA.callbacks["client.joined.error"] = 'roomJoinedFailed';

  XENTHA.connect();

  XENTHA.on('error', function(data) {
      this.showError(data);
  }.bind(this));

  XENTHA.on('connect', function(data) {
    console.log('connected.');
  }.bind(this));

  XENTHA.on('roomJoined', function(data) {
    console.log('room joined.');
  }.bind(this));

  XENTHA.on('roomJoinedFailed', function(data) {
    this.showError(data.message);
  }.bind(this));
  //
  // this.socket.on('error', function(data) {
  //   this.showError(data);
  // }.bind(this));
  //
  // this.socket.on('roomJoined', function(data) {
  //   this.roomCode = data.roomCode;
  //   this.$keypadDisplay.text("");
  //   this.$home.slideUp( "fast", function() {
  //     // this.$home.hide();
  //   });
  //   this.$controller.show();
  // }.bind(this));
}

Controller.prototype.left = function() {
  console.log('left');
  XENTHA.send('client.controls', {left: true});
}

Controller.prototype.showError = function(text) {
  this.$notification.addClass('error-notification').text(text)
  this._showNotification();
}

Controller.prototype.showSuccess = function(text) {
  this.$notification.addClass('success-notification').text(text)
  this._showNotification();
}

Controller.prototype._showNotification = function() {
    this.$notification.slideDown(500)
    .delay(3000)
    .slideUp(500);
}

Controller.prototype.right = function() {
  console.log('right');
  XENTHA.send('client.controls', {right: true});
}

Controller.prototype.up = function() {
  console.log('up');
  XENTHA.send('client.controls', {up: true});
}

Controller.prototype.down = function() {
  console.log('down');
  XENTHA.send('client.controls', {down: true});
}

Controller.prototype.select = function() {
  console.log('select');
}

Controller.prototype.keypadPressed = function(key) {
  var current = this.$keypadDisplay.text();
  if(key == "del") {
    var newInput = current.substring(0, current.length - 1)
    this.$keypadDisplay.text(newInput);
  } else if(key == "ok") {
    this.joinRoom(this.$keypadDisplay.text());
  } else {
    this.$keypadDisplay.text(current += key);
  }
}

Controller.prototype.joinRoom = function(roomCode) {
  if(!XENTHA.connected) {
    this.showError('something went wrong while connecting (joinRoom).');
    return;
  } else if(!roomCode) {
    this.showError('Please enter a room code.');
    return;
  }
  XENTHA.send('room.join', {roomCode: roomCode});
}

Controller.prototype.leaveRoom = function() {
  this.$home.show();
  this.$controller.hide();
}

Controller.prototype.leaveGame = function() {
  this.$home.show();
  this.$controller.hide();
  this.$game.hide();
}

Controller.prototype.editUser = function(user) {

}

Controller.prototype.openMenu = function() {
  this.$menu.slideDown("fast");
}


Controller.prototype.closeMenu = function() {
  this.$menu.slideUp("fast");
}
