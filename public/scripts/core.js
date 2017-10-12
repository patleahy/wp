// A few helper functions
// Pat Leahy pat@patleahy.com

core = {

  // Convert a 1D array to a 2D array. E.g.:
  // array_chunk([ 'a', 'b', 'c', 'd', 'e' ], 2) returns:
  //   [ [ 'a', 'b' ],
  //     [ 'c', 'd' ],
  //     [ 'e' ] ]
  array_chunk: function (arr, size) {
    var out = [];
    var i = 0;
    var n = arr.length;

    while (i < n) {
      out.push(arr.slice(i, i+size));
      i = i + size;
    }
    return out;
  },

  unescape: function(text) {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#039;/g, "'");
  }
};