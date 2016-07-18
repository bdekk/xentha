"use strict";

var bcrypt = require('bcrypt-nodejs');
var Q = require('q');

var BCRYPT_WORK_FACTOR = 10;

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

  var hashPassword = function (password) {
    var self = this;
    var result = Q.defer();
    console.log('has pw func');
    bcrypt.genSalt(BCRYPT_WORK_FACTOR, function onSalt(err, salt) {
      if (err) {
        return result.reject(err);
      }
      bcrypt.hash(password, salt, function empty() {}, function onHash(err, hash) {
        console.log(password);
        if (err) {
          return result.reject(err);
        }
        return result.resolve(hash);
      });
    });
    return result.promise;
  }

  var checkPassword = function checkPassword(candidate, password) {
    return bcrypt.compareSync(candidate, password);
  };
  User.checkPassword = checkPassword;

  User.beforeCreate(function (user, options) {
    return hashPassword(user.password).then(function (hashedPw) {
      user.password = hashedPw;
    });
  })

  return User;
};
