// Setup redirects for old URLs.
//
// Pat Leahy pat@patleahy.com

exports.router = function(express) {
  var router = express.Router();

  router.route('/store.php').get(function (req, res) {
    res.redirect(301, '/store');
  });
  router.route('/product.php').get(function (req, res) {
    res.redirect(301, '/store');
  });
  router.route('/cart.php').get(function (req, res) {
    res.redirect(301, '/store');
  });
  router.route('/maillist.php').get(function (req, res) {
    res.redirect(301, '/contact');
  });
  router.route('/links.php').get(function (req, res) {
    res.redirect(301, '/about');
  });
  router.route('/events.php').get(function (req, res) {
    res.redirect(301, '/about');
  });
  router.route('/events').get(function (req, res) {
    res.redirect(301, '/about');
  });
  router.route('/page.php').get(function (req, res) {
    if (req.query["p"] == "contact") {
      res.redirect(301, '/contact');
    } else {
        res.redirect(301, '/about');
    }
  });
  return router;
};