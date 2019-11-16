const express = require('express');
const expressSession = require('express-session');
const pug = require('pug');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/routes.js');
const bcrypt = require('bcrypt-nodejs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const auth = require('./routes/auth.js');

const app = express();

app.use(session({
    'secret': 'sew suppah secerete',
    'unset': 'destroy' //can logout users by setting req.session to null
}))

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname + '/public')));
app.use(cookieParser('We like cookies'));

const urlencodedParser = bodyParser.urlencoded({
    extended: true
});

app.get('/', routes.login);
app.get('/logout', routes.logout);
app.get('/edit', routes.edit);
app.get('/create', routes.create);
app.post('/create', urlencodedParser, routes.createPerson);

app.post('/login', urlencodedParser, auth.login);
app.post('/logout', urlencodedParser, auth.logout);

app.listen(3010);