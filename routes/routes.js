const config = require('../config');
let mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data');

let mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', function (callback) {

});

let personSchema = mongoose.Schema({
    username: String,
    password: String,
    age: String,
    email: String,
    answer1: String,
    answer2: String,
    answer3: String
});

function formatDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    let hh = today.getHours();
    let min = today.getMinutes();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return mm + '/' + dd + '/' + yyyy + " at " + hh + ":" + min;
}
let Person = mongoose.model('People_Collection', personSchema);
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
exports.edit = (req, res) => {
    if (req.cookies.beenHereBefore === 'yes') {
        Person.find((err, person) => {
            if (err) return console.error(err);
            res.render('edit', {
                title: 'People List',
                people: person,
                "config": config,
                cookie: "Already been here before",
                time: formatDate()
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
                cookie: "First Time Here"
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
        "config": config,
        time: formatDate()
    })
};

exports.logout = (req, res) => {
    res.clearCookie('beenHereBefore');
    res.redirect('/');
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
        "config": config,
        time: formatDate()
    });
};