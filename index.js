"use strict";

var http = require('follow-redirects').http;

var cheerio = require('cheerio')
  , iconv = require('iconv-lite');

function query(word, callback) {

  var options = {
    host: 'www.uitmuntend.de',
    path: '/search.html?search=' + escape(word),
    agent: false
  }

  fetch(word, function(res){callback(parse(res))})

  function fetch(word, callback) {
    var req = http.get(options, function(res) {
      var bodyChunks = []
      res.on('data', function(chunk) {
        bodyChunks.push(chunk)
      }).on('end', function() {
        var body = Buffer.concat(bodyChunks)
        callback(iconv.decode(body, 'iso-8859-1'))
      })
    })
    req.on('error', function(e) {throw e})
  }

  function parse(body) {
    var $ = cheerio.load(body)
    var res = {'options': options, 'translations': []}
    var trs = $('.t2 tbody tr').filter(function(i, el) {
      return el.children.length == 5
    })
    function clean(item) {
      if (item.substr(item.length-2) == ' |')
        item = item.substr(0, item.length-2)
      return item
    }
    for (var i = 0, len = trs.length; i < len; i++) {
      var tds = $(trs[i]).children()
      res.translations.push({
        'original': clean($(tds[0]).text()),
        'translation': clean($(tds[1]).text())
      })
    }
    return res
  }

}

exports.query = query;
