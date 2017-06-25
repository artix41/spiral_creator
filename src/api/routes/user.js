var mongoose = require('mongoose');
var express = require('express');

var app = express();
var SHA256 = require("crypto-js/sha256");

var User = mongoose.model('User');

function encrypt(message) {
    return SHA256(message).toString();
}

exports.create = function(req, res) {
    res.render('user-form', {
        title: 'Create user',
        buttonText: "Join!"
    });
};

exports.doCreate = function(req, res) {
    console.log("req", req.body);
    User.create({
            pseudo: req.body.pseudo,
            password: encrypt(req.body.password)
        },
        function(err, user) {
            if (err) {
                console.log(err);
                if (err.code == 11000) {
                    res.redirect("/user/new?exists=true");
                }
                else {
                    res.redirect("/error=true");
                }
            }
            else {
                console.log("User created and saved: " + user);
                req.session.user = {
                    "pseudo" : user.pseudo,
                    "_id": user._id
                };
                req.session.loggedIn = true;
                console.log("session: ", req.session);
                res.redirect('/user');
            }
        }
    )
};

// GET logged in user page
exports.index = function (req, res) {
    if(req.session.loggedIn === true) {
        res.render('user-profile', {
            title: "User profile",
            pseudo: req.session.user.pseudo,
            userID: req.session.user._id
        });
    }
    else {
        res.redirect('/login');
    }
}

exports.login = function (req, res) {
    if(req.session.loggedIn === true) {
        res.redirect('/user');
    }
    else {
        res.render('login-form', {title: 'Log in'});
    }
}

exports.doLogin = function(req, res) {
    User.findOne({
        pseudo: req.body.pseudo,
        password: encrypt(req.body.password)
    },
    null,
    function(err, user) {
        if (err || !user) {
            console.log("Error : ", err);
            res.redirect("/login?error=true");
        }
        else {
            req.session.user = {
                "pseudo" : user.pseudo,
                "_id": user._id
            };
            req.session.loggedIn = true;
            req.session.save();
            console.log("session: ", req.session);
            res.redirect('/user');
        }
    });
}

exports.doLogout = function(req, res) {
    if (req.session.loggedIn) {
        req.session.user = {};
        req.session.loggedIn = false;
        req.session.save();
    }

    res.redirect('/login')
}

