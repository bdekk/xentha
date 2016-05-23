var randomstring = require("randomstring");

module.exports = function(sequelize, DataTypes) {
  var Room = sequelize.define("Room", {
    id: { type: DataTypes.INTEGER, primaryKey: true,  autoIncrement: true },
    roomId: { type: DataTypes.STRING },
    name: DataTypes.STRING,
    maxPlayers: {type: DataTypes.INTEGER, defaultValue: 0},
    status: {type: DataTypes.INTEGER, defaultValue: 0},
    numPlayers: {type: DataTypes.INTEGER, defaultValue: 0}
  }, {
    hooks: {
      beforeCreate: function(room, options) {
        console.log('new room' + room + ' generating roomId..');
        room.roomId = randomstring.generate(6);
        return room;
      }
    },
    classMethods: {
      associate: function(models) {
        Room.hasMany(models.User);
      }
    }
  });
  return Room;
};
