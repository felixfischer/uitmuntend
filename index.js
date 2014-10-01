/*!
 * uitmuntend
 * Copyright(c) 2014 Felix Fischer <kontakt@felixfischer.com>
 * MIT Licensed
 */


"use strict"

var _ = require('lodash')
  , http = require('follow-redirects').http
  , ds_cache = require('ds-cache')
  , cheerio = require('cheerio')
  , iconv = require('iconv-lite')

var cache = new ds_cache({
  limit_bytes: '5M',
  auto_save:  true
})


/**
 * `search()` will query uitmuntend.de or use cached results
 *
 * @param {String} query
 * @param {Function} callback
 */

function search(query, callback){
  var date = new Date()
  var options = {
    host: 'www.uitmuntend.de',
    path: '/search.html?search=' + escape(query),
    agent: false,
    info: {query: query, timestamp: date.toUTCString()}
  }
  var cached = cache.get(query)
  if (cached) callback(cached)
  else
    load(options, function(body){
      var res = parse(body)
      res.options = options
      cache.set(query, res)
      callback(res)
    })
}


/**
 * `load()` is a wrapper for http.get
 *
 * @param {Object} options
 * @param {Function} callback
 */

function load(options, callback){
  var req = http.get(options, function(res){
    var bodyChunks = []
    res.on('data', function(chunk) {
      bodyChunks.push(chunk)
    }).on('end', function() {
      callback(Buffer.concat(bodyChunks))
    })
  })
  req.on('error', function(e) {callback(e, options)})
}


/**
 * `parse()` extracts results from html and returns a nice object
 *
 * example:
 *
 * { results: [ {nl: woord, de: Wort, type: 'direkte Treffer'}, ... ] }
 *
 * @param {String} body
 * @returns {Object}
 */

function parse(body) {
  var $ = cheerio.load(iconv.decode(body, 'iso-8859-1'))
  var out = { results: [], translations: [] }
  $('.t2 tbody tr').each(function(i, el){
    var cells = $(this).children()
    var rowType = _.pluck(cells, 'name').toString()
    var heading = null
    switch (rowType) {
      case 'th': // section header
        heading = $(cells).text()
        break
      case 'td,td': // actual result
        out.results.push({
          nl: $(cells[0]).text(),
          de: $(cells[1]).text(),
          type: heading
        })
        // for backwards compatibility
        out.translations.push({
          original: $(cells[0]).text(),
          translation: $(cells[1]).text()
        })
        break
    }
  })
  return out
}

// expose functions
exports.search = exports.query = search
exports.parse = parse
exports.load = load
