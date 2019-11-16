const passwords = require('./passwords');
const Person = require('./routes').Person;

exports.getActiveUser = async (req, res) => {
    if(!req.session.activeUserName){
        return null;
    }

    let user = await Person.findOne({'username': req.session.activeUserName});
    if(!user){
        user = await Person.findOne({'email': req.session.activeUserName});
    }
    return user;
};

exports.logout = (req, res) => {
  req.session = null;
};

exports.login = async (req, res) => {
    let user = await Person.findOne({'username': req.body.username});

    if(!user){
        user = await Person.findOne({'email': req.body.username});
    }

    if(!user){
        res.status(404);
        res.send('No user found');
    }

    if(!passwords.verify(req.body.password, user.password)){
        res.status(401);
        res.send('Bad Password');
    }

    req.session.activeUserName = user.username;
    res.status(200);
    res.send('logged in');
};