var Riskish = Riskish || {};

Riskish.Game = function(){};

Riskish.Game.prototype = {
  preload: function() {
    this.game.world.alpha = 1;
    this.tiles = ['grass', 'metal', 'sand', 'future', 'ice'];
  },
  create: function() {
      // background
      this.game.add.tileSprite(0, 0, 800,600, 'sea');

      this.createHexagone();

  },
  update: function() {
  },

  createHexagone: function(gridSizeX, gridSizeY) {

    var gridSizeX = gridSizeX || 15;
    var gridSizeY = gridSizeY || 8;

    var hexagonWidth = 80;
    var hexagonHeight = 82;

    var horizontalMargin = 20;
    var verticalMargin = 50;

    hexagonGroup = this.game.add.group();
    for(var i = 0; i < gridSizeY/2; i ++){
      for(var j = 0; j < gridSizeX; j ++){
        var tileSprite = this.tiles[Math.floor(Math.random() * this.tiles.length)];

        if(gridSizeY%2==0 || i+1<gridSizeY/2 || j%2==0){
          var hexagonX = hexagonWidth*j/2;
          var hexagonY = hexagonHeight*i*1.5+(hexagonHeight/4*3)*(j%2);
          var hexagon = this.game.add.sprite(hexagonX,hexagonY, tileSprite);
          hexagonGroup.add(hexagon);
        }
      }
    }
    hexagonGroup.x = (this.game.width + horizontalMargin - hexagonWidth*Math.ceil(gridSizeX/2))/2;
    if(gridSizeX%2==0){
      hexagonGroup.x-=hexagonWidth/4;
    }
    hexagonGroup.y = (this.game.height + verticalMargin - Math.ceil(gridSizeY/2)*hexagonHeight - Math.floor(gridSizeY/2)*hexagonHeight/2)/2;

    if(gridSizeY%2==0){
      hexagonGroup.y-=hexagonHeight/8;
    }
  },
  xentha: function() {
    var me = this;

    XENTHA.on('playerJoined', function (data) {
        var player = data.data.player;
        this.players.push({"xentha": player, "score": 0});
    }.bind(this));

    XENTHA.on('playerLeft', function (event) {
      this.players = this.players.filter(function(player) {
          return player.xentha.id !== event.player;
      });

      if(this.players.length === 0) {
        XENTHA.send('game.disconnect', {});
      }
    }.bind(this));
  }
};
