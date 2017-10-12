// Generate a simple site map for the main pages in the site.
//
// Pat Leahy pat@patleahy.com


var sm = require('sitemap');

exports.sitemap = function(req, res) {
  var sitemap = sm.createSitemap({
    hostname: "http://www.wilburtonpottery.com",
    cacheTime: 600000,
    urls: [
      { url: '/', changefreq: 'monthly'},
      { url: '/store', changefreq: 'daily' },
      { url: '/custom', changefreq: 'weekly' },
      { url: '/about', changefreq: 'monthly' },
      { url: '/contact', changefreq: 'monthly' }
    ]
  });

  sitemap.toXML(function(err, xml) {
    if (err) {
      return res.status(500).end();
    }
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });
};

