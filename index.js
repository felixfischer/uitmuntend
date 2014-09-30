"use strict";

var http = require('follow-redirects').http
  , cheerio = require('cheerio')
  , iconv = require('iconv-lite');

var load = require('./load')
  , parse = require('./parse');


function search(arg, callback) {
  if (typeof callback !== 'function')
    return new Error('callback should be a function')
  if (typeof arg !== 'string')
    return callback(new Error('arg should be a string'))
  var options = {
    host: 'www.uitmuntend.de',
    path: '/search.html?search=' + escape(arg),
    agent: false
  }
  load(options, function(res){
    callback(parse(res, options))
  })
}

exports.load = load
exports.parse = parse
exports.search = exports.query = search
