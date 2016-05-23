"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    username: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    won: DataTypes.INTEGER,
    lose: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });

  return User;
};
