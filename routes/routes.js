const config = require('../config');

exports.create = (req, res) => {
    res.render('create',{
        "title": "Create",
        "config": config
    });
};

exports.login = (req, res) => {
    res.render('login',{
        "title": "Login",
            "config": config
    });
};