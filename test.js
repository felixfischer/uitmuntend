"use strict";

var uitmuntend = require('./index.js');

function assert(condition, message) {
  if (!condition) {
    message = message || "FAIL";
    throw new Error(message);
  } else {
    console.log('OK');
  }
}

uitmuntend.query('woord', function(res){
  assert(res.translations[0].original == 'woord-');
  assert(res.translations[0].translation == 'Wort-');
});
