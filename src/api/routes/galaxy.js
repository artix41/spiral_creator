var mongoose = require('mongoose');
var express = require('express');

var app = express();

var Galaxy = mongoose.model('Galaxy');

exports.create = function(req, res) {
    console.log(req.session)
    if (!req.session.loggedIn){
        res.redirect('/login');
    }
    else {
        res.render('galaxy-form', {
        title: 'Add galaxy',
        buttonText: 'Add galaxy',
        hubbleChoices: ['Sa', 'Sb', 'Sc', 'SBa', 'SBb', 'SBc', 'E0', 'E1',
                        'E2', 'E3', 'E4', 'E5', 'E6', 'E7'],
        typeChoices: ['spiral', 'elliptical', 'lenticular', 'irregular']
    })
    }
    
};

exports.doCreate = function(req, res) {
    if (!req.session.loggedIn){
        res.redirect('/login');
    }
    else {
        Galaxy.create({
            name: req.body.name,
            image: req.body.image,
            constellation: req.body.constellation,
            distance: req.body.distance,
            dimension: req.body.dimension,
            mass: req.body.mass,
            otherNames: req.body.otherNames,
            image: req.body.image,
            description: req.body.description,
            type: req.body.type,
            hubbleSequence: req.body.hubbleSequence
        },
        function(err, galaxy) {
            if (err) {
                console.log(err);
                if (err.code == 11000) {
                    res.redirect("/galaxy/new?exists=true");
                }
                else {
                    res.redirect("/galaxy/new?error=true");
                }
            }
            else {
                console.log("Galaxy added and saved: " + galaxy);
                res.redirect('/galaxy/new');
            }
        })
    }
    
};

exports.search = function(req, res) {
    var query = {
        _id: req.query.id,
        type: req.query.type,
        hubbleSequence: req.query.hubble
    };
    if (req.query.id && !req.query.id.match(/^[0-9a-fA-F]{24}$/)) {
            res.send("<b>Error : Invalid ID</b>");
    }

    else {
        // The line below deletes all keys with value=undefined
        console.log(query)
        Object.keys(query).forEach((key) => (query[key] == null) && delete query[key]);

        Galaxy.find(query, function(err, listGalaxies) {
            if (err) {
                console.log("Error : ", err);
            }
            else {
                console.log(listGalaxies);
                res.json(listGalaxies);
            }
        });
    }
};

exports.delete = function(req, res) {
    if (!req.session.loggedIn){
        res.redirect('/login');
    }
    else if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        res.send("<b>Error : Invalid ID</b>");
    }
    else {
        Galaxy.findByIdAndRemove(req.params.id, function(err, galaxy) {
            if (err || !galaxy) {
                console.log("Error: ", err);
                res.send("<b>Error : Could not find galaxy with given id</b>");
            }
            else {
                //console.log("Galaxy " + galaxy._id + " deleted");
                res.send("<b>Galaxy deleted</b>");
            }
        })
    }
    
};
