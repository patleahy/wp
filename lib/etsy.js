// Class to help with Etsy authentication.
//
// TODO: Should this be refractered into express middleware?
//
// Pat Leahy pat@patleahy.com

var oauth = require("oauth").OAuth;
var cfg = require('../../cfg.json');

// Create the helper.
// callback is the URL to a page which Etsy will redirect users to after they
// have authenticated on the Etys site.
//
// Use this as follows:
//
// 1. Create a instance of Etsy. Store it somewhere, e.g. in Express app.
// 2. Call setup once of there is no etsy element int the user's session.
// 3. Call callback when Etsy redirects back the the callback URL.
// 4. Call gets APIs using Etsy.oauth.get(...).
//
var Etsy = function(callback) {
  var that = this;

  that.oauth  = new oauth(
    "https://openapi.etsy.com/v2/oauth/request_token?scope=transactions_r",
    "https://openapi.etsy.com/v2/oauth/access_token",
    cfg.ETSY.API_KEY,
    cfg.ETSY.API_SECRET,
    "1.0",
    callback,
    "HMAC-SHA1"
  );

  // Start the authentication process.
  this.setup = function (req, res) {
    that.oauth.getOAuthRequestToken(function(err, token, token_secret, results){
      if ( err ) {
        console.log( err );
      } else {
        // Store Etsys session specific data in the user's session.
        // Then redirect the user to the Etsy login page.
        req.session.etsy = {};
        req.session.etsy.token = token;
        req.session.etsy.token_secret = token_secret;
        res.redirect(results.login_url);
      }
    });
  };

  // Our calback page will call this function after a successful authentication/
  // Safe the Etsy token data we get back in the user's session.
  this.callback = function(req, res, redirect) {
    req.session.etsy.verifier = req.query.oauth_verifier;
    var auth = req.session.etsy;

    that.oauth.getOAuthAccessToken(
      auth.token,
      auth.token_secret,
      auth.verifier,
      function (err, token, token_secret, results) {
        if (err) {
          console.log(err);
        } else {
          req.session.etsy.access_token = token;
          req.session.etsy.access_token_secret = token_secret;
          res.redirect(redirect);
        }
      }
    );
  };
};

module.exports = Etsy;