var express = require('express');
var app = express();

exports.index = function (req, res) {
    console.log("session: ", req.session);
    res.render('index', {title: 'GalAPI : Open Galaxy API'})
}
