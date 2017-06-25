const path = require('path');

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var db = require('./model');
var routes = require('./routes/index');
var user = require('./routes/user');
var galaxy = require('./routes/galaxy');

var cookie_secret = "osef";

var app = express();

app.use(cookieParser());
app.use(session({
    secret: cookie_secret,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '/views'));
app.use('/static', express.static(__dirname + '/public'));

//var session = require('cookie-session');

/*app.use(session({
  keys: ['key1', 'key2'],
  secureProxy: true // if you do SSL outside of node
}));*/

app.get('/', routes.index);

app.get('/user', user.index);
app.get('/user/new', user.create);
app.post('/user/new', user.doCreate);
app.get('/login', user.login);
app.post('/login', user.doLogin);
/*app.get('/user/edit', user.edit);
app.post('/user/edit', user.doEdit);
app.post('/user/delete', user.confirmDelete);*/
app.get('/logout', user.doLogout);

// app.get('/galaxy', galaxy.index);
app.get('/galaxy/search', galaxy.search);
app.get('/galaxy/new', galaxy.create);
app.post('/galaxy/new', galaxy.doCreate);
// app.get('/galaxy/edit/:id', galaxy.edit);
// app.post('/galaxy/edit/:id', galaxy.doEdit);
app.get('/galaxy/delete/:id', galaxy.delete);


module.exports = app;
