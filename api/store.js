// The API for getting store items.
//
// Store items are read from Etsy.
//
// There are two APIs:
//
// items returns the list of items for sale. This doesn't require Etsy authentication.
// sold returns the items which have already been sold. This does require Etsy authentication.
//
// Pat Leahy pat@patleahy.com

var cfg = require('../../cfg.json');

var Client = require('node-rest-client').Client;
var client = new Client();
var args = {
  path: {
    'shop_name': 'WilburtonPottery',
    'api_key': cfg.ETSY.API_KEY
  }
};

// Returns the items which have already been sold.
// This does require Etsy authentication.
var sold = function(etsy, etsy_session, callback) {

  var items = [];

  // Get 100 items at items offset 'next_offset'.
  var get = function (etsy_session, next_offset, callback) {
    etsy.oauth.get(
      'https://openapi.etsy.com/v2/shops/WilburtonPottery/transactions?limit=100&includes=MainImage&offset=' + next_offset,
      etsy_session.access_token,
      etsy_session.access_token_secret,
      function (err, data) {
        if (err) {
          callback({'status' : 'error'});
          return;
        }

        var json = JSON.parse(data);

        for (var i = 0; i < json.results.length; i++) {
          var result = json.results[i];
          items.push({
            'id': result.listing_id,
            'title': result.title,
            'price': result.price,
            'url': 'https://www.etsy.com/listing/' + result.listing_id,
            'small_img': result.MainImage.url_170x135
          });
        }

        // Recursively call this function untill load all the sold items, 100 at a time.
        var next_offset = json.pagination.next_offset;
        if (next_offset != null) {
          get(etsy_session, next_offset, callback);
        } else {
          callback({'items' : items});
        }
      }
    );
  };

  // Start at offset 0.
  get(etsy_session, 0, callback);
};

exports.sold = sold;