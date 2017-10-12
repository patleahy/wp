// The router for the server side APIs used by the site.
// Attach this to the top level express router.
//
// Pat Leahy pat@patleahy.com

var path = require('path');

exports.router = function(app, express) {

  var that = this;
  this.app = app;

  var router = express.Router();

  // Get store items API.
  router.route('/store')
    .get(function (req, res) {
      res.setHeader('Cache-Control', 'public, max-age=300');
      res.sendFile(path.join(__dirname, '../public/store.json'));
    });

  // Gets a list of items already sold.
  // This assumes we have already authenticated with Etsy.
  router.route('/sold')
    .get(function(req, res) {
      var store = require('./store');
      store.sold(
        that.app.etsy,
        req.session.etsy,
        function(items) {
          res.json(items);
        }
      );
    });

  return router;
};
