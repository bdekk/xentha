function Emitter(obj) {
  if (obj) return mixin(obj);
};

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }
  return this;
};

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

var XENTHA = {
  ws: "ws://192.168.2.5:3000",
  api: "http://192.168.2.5:3000",
  connected: false,
  apiKey: "",
  callbacks: {},
  room: {},
  players: []
};

XENTHA.connect = function() {

  if(!window.parent) {
    console.error('Could not find parent.');
  }

  if(window.addEventListener){
	  window.addEventListener("message", this._receive, false);
	} else if (window.attachEvent){
		window.attachEvent("message", this._receive, false);
	}

  XENTHA.send('game.init', {"apiKey": this.apiKey});
}

// send data to parent (controller)
XENTHA.send = function(id, data) {
    window.parent.postMessage(JSON.stringify({"id": id, "data": data}),"*");
}

// receive data from parent iframe (controller)
XENTHA._receive = function(event) {
    var data = JSON.parse(event.data);
    if(!data.id || !data.data) {
      XENTHA.emit('error', 'message does not have an id or data.');
      return;
    }

    XENTHA.emit('_' + data.id, data.data);
    XENTHA.emit(XENTHA.callbacks[data.id], data.data);
}

Emitter(XENTHA);

XENTHA.on('_player.joined', function(event) {
  XENTHA.players.push(event.data.player);
});

XENTHA.on('_player.left', function(event) {
  XENTHA.players = XENTHA.players.filter(function (player) {
      return player.id !== event.data.player.id;
  });
});

window.XENTHA = XENTHA;
