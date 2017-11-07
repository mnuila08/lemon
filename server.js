//Set-up with necessary tools"

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require ('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

mongoose.Promise = global.Promise;
mongoose.connect(configDB.database, {useMongoClient: true });

var jwt = require('jsonwebtoken');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var User = require('./models/user');

//set up our expresss application
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

//set up ejs for templating
app.set('view engine', 'ejs');

//Passport Set-up:
app.use(session({secret: 'aliasgariisawesome'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); //use connect-flash for flash messages

//routes
require('./routes/routes.js')(app, passport);

//launch
app.listen(port);
console.log('Lemon Project magic on port ' + port);
