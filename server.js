var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var compression = require('compression');
var app = express();
var path = require('path');
var exphbs = require('express-handlebars');

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// app.use(expressValidator());
// IF WE NEED TO SERVE SOME FILES (stylesheets, scripts, etc.), USE THIS:
app.use(express.static(path.join(__dirname, 'public')));

app.use(compression({ filter: shouldCompress }))

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header 
    return false
  }
  // fallback to standard filter function 
  return compression.filter(req, res)
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, *");
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
const corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));

app.get('/', function(req, res, next) {
  console.log('inside /')
  res.render('index.hbs')
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
});

var port = process.env.PORT || 3100;
app.listen(port);
console.log('Express started. Listening on port %s', port);

module.exports = app;

