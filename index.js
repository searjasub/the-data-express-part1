const express = require('express');
const expressSession = require('express-session');
const pug = require('pug');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/routes.js');
const bcrypt = require('bcrypt-nodejs');

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname + '/public')));

const urlencodedParser = bodyParser.urlencoded({extended:false});

app.listen(3001);