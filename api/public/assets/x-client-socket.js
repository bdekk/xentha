// server xentha library. Use this to create your xentha game :)
var pathArray = window.location.pathname.split( 'room' );

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
  ws: "ws://localhost:3000",
  // api: "http://localhost:3000",
  connected: false,
  callbacks: {},
  room: {},
  vars: {
    autoJoin: true,
    roomCode: getParameterByName('room')
  }
};

XENTHA.connect = function(url) {
  url = url || this.ws;
  XENTHA.socket = new WebSocket(url);

  XENTHA.socket.onopen = function(event) {
        XENTHA.connected = true;
        if(XENTHA.vars.autoJoin && XENTHA.vars.roomCode) {
            XENTHA.send('room.join', {roomCode: XENTHA.vars.roomCode});
        }
  };

  /** if a message is received on this socket, call the related method **/
  XENTHA.socket.onmessage = function (event) {
    XENTHA._receive(event);
  };

  XENTHA.socket.onerror = function(data) {
    XENTHA.emit('error', 'error while connecting..');
  };

  XENTHA.socket.onclosed = function(event) {
    XENTHA.emit('error', 'client closed.');
  };

}

XENTHA.send = function(id, data) {
  if(!XENTHA.connected || !XENTHA.socket) {
    console.error('Socket is not connected.');
    return;
  }

  XENTHA.socket.send(JSON.stringify({"id": id, "data": data}));
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

/** Callbacks **/
XENTHA.on('error', function (data) {
});

XENTHA.on('connect', function () {
});

XENTHA.on('disconnect', function () {
});

XENTHA.on('_room.joined', function(data) {
    XENTHA.room = data;
}.bind(this));

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

window.XENTHA = XENTHA;
