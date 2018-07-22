var methods = {};
var User = require('../models').User;
var Room = require('../models').Room;
var Game = require('../models').Game;
methods.get = function (req, res, next) {
    User.findAll().then(function (users) {
        return res.send({ users: users });
    });
};
methods.getOne = function (req, res, next) {
    User.findOne({ where: { id: req.params.id } }).then(function (user) {
        return res.send({ user: user });
    });
};
methods.create = function (req, res, next) {
    var user = req.body.user;
    if (user && user.username && user.password) {
        User.create(user).then(function (user) {
            return res.send({ user: user });
        });
    }
    else {
        return res.send(400, { error: "supply data" });
    }
};
methods.delete = function (req, res, next) {
    if (req.params.userId) {
        User.destroy({
            where: {
                id: req.params.userId
            }
        }).then(function (rowDeleted) {
            if (rowDeleted === 1) {
                res.send({ success: true });
            }
            else {
                res.send(404, { error: "Could not find game." });
            }
        }, function (err) {
            res.send(400, { "error": err });
        });
    }
    else {
        return res.send(400, { error: "supply data" });
    }
};
methods.getGames = function (req, res, next) {
    if (req.params.userId) {
        Game.findAll({ "where": { "authorId": req.params.userId } }).then(function (games) {
            return res.send({ games: games });
        });
    }
};
methods.login = function (req, res, next) {
    if (req.body.user) {
        console.log(req.body.user);
        User.findOne({ where: { username: req.body.user.username } })
            .then(function (user) {
            if (!user) {
                // wrong username
                return res.status(401).json({
                    error: "wrong emailaddress"
                });
            }
            else if (!User.checkPassword(req.body.user.password, user.password)) {
                // wrong password
                return res.status(401).json({
                    error: "wrong password"
                });
            }
            else if (user) {
                user.password = undefined; //remove password.d
                res.status(200).json({ user: user });
            }
            else {
                // errror
                res.status(400).json({
                    error: 'Something went wrong.'
                });
            }
        });
    }
};
module.exports = methods;
