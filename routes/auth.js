const passwords = require('./passwords');
const routes = require('./routes.js');

exports.tryLoginActiveUser = async (req, res) => {
    console.log("a");
    person = await exports.getActiveUser(req, res);
    if(!person){
        console.log("b");
        person = await exports.login(req, res);
        if(!person){
            console.log("c");
            res.status(401);
            res.send('Not logged in');
            return false;
        }
    }
    return person;
};

exports.getActiveUser = async (req, res) => {
    if(!req.session.activeUserName){
        return false;
    }

    let user = await routes.Person.findOne({'username': req.session.activeUserName});
    if(!user){
        user = await routes.Person.findOne({'email': req.session.activeUserName});
    }
    return user;
};

exports.logout = (req, res) => {
  req.session = null;
  res.redirect("/")
};

exports.login = async (req, res) => {
    console.log(req.query);
    let user = await routes.Person.findOne({'username': req.query.username});

    if(!user){
        user = await routes.Person.findOne({'email': req.query.username});
    }

    if(!user){
        res.status(404);
        res.send('No user found');
    }

    if(!passwords.verify(req.query.password, user.password)){
        res.status(401);
        res.send('Bad Password');
    }

    req.session.activeUserName = user.username;
    return user;
};