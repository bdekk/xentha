"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    username: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    password: {type: DataTypes.STRING, defaultValue: null},
    won: {type: DataTypes.INTEGER, defaultValue: 0},
    lose: {type: DataTypes.INTEGER, defaultValue: 0},
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });

  return User;
};
