module.exports = function(sequelize, DataTypes) {
  var Score = sequelize.define("Score", {
    id: { type: DataTypes.INTEGER, primaryKey: true,  autoIncrement: true },
    roomCode: { type: DataTypes.STRING },
    gameName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    score: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
          Score.hasOne(models.Game, {as: "gameId", foreignKey: "id"});
          Score.hasOne(models.User, {as: "userId", foreignKey: "id"});
      }
    }
  });
  return Score;
};
