// Node App for the WilburtonPottery site.
//
// Pat Leahy pat@patleahy.com

var cfg = require('../cfg.json');

var port = 8080;

var path = require('path');

var express = require('express');
var app = express();

// Compress responses.
var compression = require('compression');
app.use(compression());

var session = require('express-session');
app.use(session({
  secret: cfg.APP.SESSION_SECRET,
  name: 'wpid',
  resave: true,
  saveUninitialized: true
}));

// Static files from from public.
app.use(express.static('public'));

// Views are rendered from pug files in views.
app.set('views', 'views');
app.set('view engine', 'pug');

// Setup redirects for old URLs
var legacy = require('./legacy');
var legacyRouter = legacy.router(express);
app.use('/', legacyRouter);

// Setup API routes under /api
var api = require('./api/api');
app.use('/api', api.router(app, express));

// Generate a site map.
var sitemap = require('./sitemap').sitemap;
app.route('/sitemap.xml').get(sitemap);

// Route for client files.
// No path will render index.
var clientRouter = express.Router();
clientRouter.route('/')
  .get(function(req, res) {
    res.render('index');
  });

clientRouter.route('/sold')
  .get(function(req, res) {
    // The etsy object is a helper which handles Etsy authentication.
    // This will be created once for the lifetime of the app.
    // We don't create it on app startup becuase its is only needed when someone calls the sold API which is perhaps
    // once a week.
    if (!app.etsy) {
      var Etsy = require('./lib/etsy');
      // This is the page Etsy will redirect the user to after then have authenticated.
      app.etsy = new Etsy('http://' + req.headers.host + '/etsy-callback');
    }
    if (req.query.reauth) {
      // If the page '/sold?reauth' is called then clear the saved Etsy auth
      // info in the session and redirect back  to '/sold' to force a
      // re-authentication.
      req.session.etsy = null;
      res.redirect('/sold');
    } else if (!req.session.etsy) {
      // If there is no Etsy auth info in the session then call Etsy.setup which will do the
      // authentication.
      app.etsy.setup(req, res);
    } else {
      // We have a authenticated Etsy session so render the page.
      res.render('sold');
    }
  });

clientRouter.route('/etsy-callback')
  .get(function (req, res) {
    // Etsy calles this after the user is authenticated.
    // We need to pull some info out of the request and then redirect to the '/sold' page.
    app.etsy.callback(req, res, '/sold');
  });

// Render favicon.ico from any folder.
clientRouter.route('*favicon.ico')
  .get(function (req, res) {
    res.sendFile(path.join(__dirname, '/public/favicon.ico'));
  });

// Any other page name after / will render the pug file with that name.

clientRouter.route('/:page')
  .get(function(req, res) {
    // Be paranoid about filenames to prevent path traversal attacks.
    // Only allow word characters, including '_'.
    var page = req.params.page.replace(/\W/, '');
    res.render(page);
  });
clientRouter.route('*')
  .get(function(req, res) {
    console.log('client route *: ' +
      (new Date()).toJSON() + ' | ' +
      req.connection.remoteAddress + ' | ' +
      req.headers['user-agent'] + ' | ' +
      req.params[0]);
    res.redirect('/');
  });
app.use('/', clientRouter);

// Handle any errors.
app.use(function (err, req, res, next) {
  console.log('error: ' +
    (new Date()).toJSON() + ' | ' +
    req.connection.remoteAddress + ' | ' +
    req.headers['user-agent'] + ' | ' +
    err);
  console.log(err);
  if (err.message && err.message.startsWith('Failed to lookup view')) {
    res.status(404).render('notfound');
  } else {
    res.status(500).render('notfound');
  }
});

// Start the app.
app.listen(port, function(err) {
  console.log('info: ' + (new Date()).toJSON() + ' | ' + 'server on port ' + port);
});