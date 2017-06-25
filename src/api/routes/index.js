var express = require('express');
var app = express();

exports.index = function (req, res) {
    res.render('index', {title: 'GalAPI : Open Galaxy API'})
}
