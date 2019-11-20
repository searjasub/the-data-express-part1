const express = require('express');
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
    'secret': 'sew suppah secerete'
}));

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname + '/public')));
app.use(cookieParser('We like cookies'));

const urlencodedParser = bodyParser.urlencoded({
    extended: true
});

const asyncRoute = route => (req, res, next = console.error) =>
  Promise.resolve(route(req, res)).catch(next)

app.get('/', asyncRoute(routes.login));
app.get('/logout', asyncRoute(routes.logout));
app.get('/edit', asyncRoute(routes.edit));
app.get('/create', asyncRoute(routes.create));
app.get('/home', asyncRoute(routes.home));

app.post('/delete', urlencodedParser, asyncRoute(routes.pushDelete));
app.post('/edit', urlencodedParser, asyncRoute(routes.pushEdit));
app.post('/create', urlencodedParser, asyncRoute(routes.createPerson));
app.post('/login', urlencodedParser, asyncRoute(auth.login));
app.post('/logout', urlencodedParser, asyncRoute(auth.logout));

app.listen(3010);