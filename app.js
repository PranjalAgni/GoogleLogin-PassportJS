const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;
const configDB = require('./config/database.js');

mongoose.connect(configDB.url);
var db = mongoose.connection;
//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("we're connected!");
});
require('./config/passport.js')(passport);


app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext',
saveUninitialized: true,
resave: true}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.set('view engine' , 'ejs');
require('./app/routes.js')(app , passport);
app.listen(port);
console.log('Server running on port '+ port);