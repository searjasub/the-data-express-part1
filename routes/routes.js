const config = require('../config');
var mongoose = require('mongoose');
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
    question1: String,
    question2: String,
    question3: String
});


var Person = mongoose.model('People_Collection', personSchema);
exports.Person = Person;

exports.index = (req, res) => {
    Person.find((err, person) => {
        if (err) return console.error(err);
        res.render('index', {
            title: 'People List',
            people: person,
            "config": config
        });
    });
};

exports.index = (req, res) => {
    Person.find((err, person) => {
        if (err) return console.error(err);
        res.render('index', {
            title: 'People List',
            people: person,
            "config":config
        });
    });
};

exports.create = (req, res) => {
    res.render('create', {
        "title": "Create",
        "config": config
    })
};

const pass = require('./passwords.js')
exports.createPerson = (req, res) => {
    var person = new Person({
        username: req.body.username,
        password: pass.saltAndHash(req.body.password),
        age: req.body.age,
        email: req.body.email,
        question1: req.body.question1,
        question2: req.body.question2,
        question3: req.body.question3
    });
    person.save((err, person) => {
        if (err) return console.error(err);
        console.log(req.body.name + ' added');
    });
    res.redirect('/');
};

exports.login = (req, res) => {
    res.render('login', {
        "title": "Login",
        "config": config
    });
};