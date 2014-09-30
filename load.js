"use strict";

var http = require('follow-redirects').http
  , fs = require('fs');

function load(it, callback){

  if (typeof it === 'object') fetch(it, callback);
  if (typeof it === 'string') open(it, callback);

  function fetch(options, callback){
    var req = http.get(options, function(res) {
      var bodyChunks = []
      res.on('data', function(chunk) {
        bodyChunks.push(chunk)
      }).on('end', function() {
        callback(Buffer.concat(bodyChunks))
      })
    })
    req.on('error', function(e) {callback(e, options)})
  }

  function open(file, callback){
    fs.readFile(file, function (err, data){
      if (err) {
        callback(err)
      }
      else {callback(data)}
    })
  }

}

module.exports = load
