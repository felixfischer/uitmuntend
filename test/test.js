"use strict";

var should = require('should')
  , fs = require('fs')
  , util = require('util')
  , uitmuntend = require('../index.js')

var cacheFile = './ds_cache.json'

function inspect(obj){
  //console.log(util.inspect(obj, {colors: true, depth: 5}))
}

describe("search(arg, callback)", function(){

  beforeEach(function(done){
    if (fs.existsSync(cacheFile)) fs.unlinkSync(cacheFile)
    done()
  })

  // futile search
  it("arg='xpqyz' should call back with an empty result set", function(done){
    if (fs.existsSync(cacheFile)) fs.unlinkSync('./ds_cache.json')
    return uitmuntend.search('xpqyz', function(res){
      res.should.be.an.Object.with.property('translations')
      res.translations.should.be.an.Array.which.is.empty
      res.should.be.an.Object.with.property('results')
      res.results.should.be.an.Array.which.is.empty
      inspect(res)
      done()
    })
  })

  function trySearch(input, expectRes1, expectRes2){
    var expectRes = "'" + expectRes1 + "', '" + expectRes2 + "'"
    var exp = "results for '" + input + "' should contain: " + expectRes
    it(exp, function(done){
      return uitmuntend.search(input, function(res){
        res.should.be.an.Object.with.property('results')
        res.results.should.be.an.Array
        res.results[0].should.be.an.Object.with.keys('nl', 'de', 'type')
        res.results[0].nl.should.containEql(expectRes1)
        res.results[0].de.should.containEql(expectRes2)
        res.results[0].type.should.containEql('direkte Treffer')
        inspect(res)
        done()
      })
    })
  }

  // searching for the first time, will need to fetch
  trySearch('Gläser', 'potten', 'Glas')
  trySearch('zoektochten', 'zoektocht', 'Suche')
  // searching for the second time, expecting fast cached results
  trySearch('Gläser', 'potten', 'Glas')
  trySearch('zoektochten', 'zoektocht', 'Suche')

})

