const config = require('../config');
var mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data');

var mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', function (callback) {

});

var personSchema = mongoose.Schema({
    username: String,
    password: String,
    age: String,
    email: String,
    answer1: String,
    answer2: String,
    answer3: String
});


var Person = mongoose.model('People_Collection', personSchema);

exports.edit = (req, res) => {
    if(req.cookies.beenHereBefore === 'yes') {
        Person.find((err, person) => {
            if (err) return console.error(err);
            res.render('edit', {
                title: 'People List',
                people: person,
                "config": config,
                cookie : "Already been here before"
            });
        });
    } else {
        res.cookie('beenHereBefore', 'yes');
        Person.find((err, person) => {
            if (err) return console.error(err);
            res.render('edit', {
                title: 'People List',
                people: person,
                "config": config,
                cookie : "First Time Here"
            });
        });
    }
};

exports.create = (req, res) => {
    if(req.cookies.beenHereBefore === 'yes'){

    } else {
        res.cookie('beenHereBefore', 'yes')
    }
    res.render('create', {
        "title": "Create",
        "config": config
    })
};

const pass = require('./passwords.js');
exports.createPerson = (req, res) => {
    var person = new Person({
        username: req.body.username,
        password: pass.saltAndHash(req.body.password),
        age: req.body.age,
        email: req.body.email,
        answer1: req.body.answer1,
        answer2: req.body.answer2,
        answer3: req.body.answer3
    });
    person.save((err, person) => {
        if (err) return console.error(err);
        console.log(req.body.username + ' added');
    });
    res.redirect('/');
};

exports.login = (req, res) => {
    if(req.cookies.beenHereBefore === 'yes'){

    } else {
        res.cookie('beenHereBefore', 'yes')
    }
    res.render('login', {
        "title": "Login",
        "config": config
    });
};