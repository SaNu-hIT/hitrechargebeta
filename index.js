var express = require('express');
var app = express();
app.use(express.static('public'));
app.use(express.static('routes'));
app.use(express.static('views'));
const bodyParser = require("body-parser");
const InitiateMongoServer = require("./config/db");
const refreshToken = require("./config/refreshToken");
const shops = require("./routes/shops");
const recharge = require("./routes/recharge");
const operators = require("./routes/operators");
const topups = require("./routes/topups");
const transactions = require("./routes/transactions");
const distributor = require("./routes/distributor");
var cookieParser = require('cookie-parser');
var engine = require('ejs-locals');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.engine('ejs', engine);
// Middleware
app.use(bodyParser.json());
// Initiate Mongo Server
InitiateMongoServer();


app.use("/admin", distributor);
//for create shope with phone,name,password
app.use("/shop", shops);
//for login as shop username
app.use("/recharge", recharge);

app.use("/operators", operators);

app.use("/topups", topups);

app.use("/transactions", transactions);

app.use("/distributor", distributor);




// for web

app.get('/', function(req, res) {
  res.render('login.ejs');
});




app.get('/profile', function(req, res) {

  res.render('profile.ejs');

});

app.get('/adash', function(req, res) {
  res.render('admindash.ejs');

});

app.get('/transactionsall', function(req, res) {
  res.render('transactionsall.ejs');

});

// Distributor side
app.get('/login', function(req, res) {
  res.render('login.ejs');
});
app.get('/shoplogin', function(req, res) {
  res.render('shoplogin.ejs');
});
app.get('/ddash', function(req, res) {
  res.render('distributordash.ejs');
});
app.get('/addshops', function(req, res) {
  res.render('addshops.ejs');
});

app.get('/addwallet', function(req, res) {
  res.render('addwallet.ejs');
});
app.get('/adddistributor', function(req, res) {
  res.render('adddistributor.ejs');
});
app.get('/addPlans', function(req, res) {
  res.render('addplans.ejs');
});
app.listen(process.env.PORT || 3000, function() {
  console.log('listening on ports');
});