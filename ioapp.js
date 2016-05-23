module.exports = function(io) {

	io.sockets.on('connection', function ( socket ) {
	
	    // a socket has connected :)
 
	   // Globals set in join that will be available to
	   // the other handlers defined on this connection
	   var _room, _id, _player;
	 
	   socket.on( 'join', function ( data ) {
	 
	      // Static helper to lookup of a game based on the room 
	      Game.findByRoom( data.room, function( err, game ) {
	 
		 var pcnt = 0, pidx;
	 
		 if ( game ) {
		     
		    // Remember this for later
		    _id = game._id;
		    _room = game.room;
		    _player = data.player;
	 
		    // Another helper to find player by ID in the
		    // players array.  They should already be there
		    // since the API functions will have set it up.
		    pidx = game.findPlayer( _player );
	 
		    if ( pidx !== false ) {
	 
		       // Join the room.
		       socket.join( _room );
	 
		       // Now emit messages to everyone else in this room.  If other
		       // players in this game are connected, only those clients 
		       // will receive the message
		       io.sockets.in( _room ).emit( 'joined' );
		        
		       // Now, check if everyone is here
		       game.players.forEach(function( p ) {
		          if ( p.status == 'joined' )
		             pcnt++;
		       });
		        
		       // If so, update statuses, initialize
		       // and notify everyone the game can begin
		       if ( pcnt == game.numPlayers ) {
	 
		          game.save(function( err, game ) {
		             io.sockets.in( _room ).emit( 'ready' );
		          });
	 
		       }
	 
		    }
		 }
	      });
	   });
	});
}
