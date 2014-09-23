"use strict";

var http = require('follow-redirects').http,
    cheerio = require('cheerio'),
    iconv = require('iconv-lite');

module.exports = {
  query: function(word, callback) {
    Uitmuntend.fetch(word, function(res) {
      callback(Uitmuntend.parse(res));
    })
  },

}

var Uitmuntend = {

  fetch: function(word, callback) {
    var options = {
      host: 'www.uitmuntend.de',
      path: '/search.html?search=' + escape(word),
      agent: false
    };
    var req = http.get(options, function(res) {
      var bodyChunks = [];
      res.on('data', function(chunk) {
        bodyChunks.push(chunk);
      }).on('end', function() {
        var body = Buffer.concat(bodyChunks);
        callback(iconv.decode(body, 'iso-8859-1'));
      })
    });
    req.on('error', function(e) {
      throw "error fetching results";
    });
  },

  parse: function(body) {
    var res = {'translations': []};
    var $ = cheerio.load(body);
    var trs = $('.t2 tbody tr').filter(function(i, el) {
      return el.children.length == 5;
    });
    var clean = function(item) {
      if (item.substr(item.length-2) == ' |') {
        item = item.substr(0, item.length-2);
      };
      return item;
    };
    for (var i = 0, len = trs.length; i < len; i++) {
      var tds = $(trs[i]).children();
      res.translations.push({
        'original': clean($(tds[0]).text()),
        'translation': clean($(tds[1]).text())
      });
    }
    return res;
  }

}

