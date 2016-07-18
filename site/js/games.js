var HOST = 'http://localhost:3000';
var API = HOST + '/api';

var GAMES_ROUTE = '/games';

function getGames() {
  $.get(API + GAMES_ROUTE)
  .done(function( data ) {
    if(data.games) {

      var gameList = $('#gameList');
      for (var i=0; i<data.games.length; i++) {
        var div = $('<div />', {
          "class": 'col-lg-4',
          "style": 'cursor: pointer',
          click: function(e){
           e.preventDefault();
          }
        }).append($('<div />', {
          "class": 'polaroid'
        }).append($('<img />', {
          "src": HOST + data.games[i].image || 'img/no_game_image.png',
          "style": "width:100%"
        }), $('<div />', {
          "class": 'overlay'
        }), $('<h3 />', {
          "text": data.games[i].name,
          // "style": "width:100%"
        })));
        gameList.append(div);
      }
    } else {
      console.err('Could not do get games.');
    }
  });
}

getGames();
