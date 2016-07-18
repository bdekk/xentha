var randomstring = require("randomstring");

module.exports = function(sequelize, DataTypes) {
  var Game = sequelize.define("Game", {
    id: { type: DataTypes.INTEGER, primaryKey: true,  autoIncrement: true },
    apiKey: { type: DataTypes.STRING },
    name: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: function(game, options) {
        game.apiKey = randomstring.generate(12);
        return game;
      }
    },
    classMethods: {
    }
  });
  return Game;
};
