var randomstring = require("randomstring");

module.exports = function(sequelize, DataTypes) {
  var Room = sequelize.define("Room", {
    id: { type: DataTypes.INTEGER, primaryKey: true,  autoIncrement: true },
    roomCode: { type: DataTypes.STRING },
    name: DataTypes.STRING,
    maxPlayers: {type: DataTypes.INTEGER, defaultValue: 0},
    status: {type: DataTypes.INTEGER, defaultValue: 0},
    numPlayers: {type: DataTypes.INTEGER, defaultValue: 0}
  }, {
    hooks: {
      beforeCreate: function(room, options) {
        room.roomCode = randomstring.generate(6);
        return room;
      }
    },
    classMethods: {
      associate: function(models) {
        Room.hasMany(models.User, {foreignKey: 'roomCode'});
      }
    }
  });
  return Room;
};
