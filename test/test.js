"use strict";

var fs = require('fs')
  , should = require('should')
  , uitmuntend = require('../index.js');

var testFile = ''

describe("load(path, callback)", function(){
  // file loading test
  it("should load a local file", function(done){
    uitmuntend.load(__dirname + '/sample-results/suche.html', function(res){
      res.should.not.be.empty
      testFile = res
      done()
    })
  })
})

describe("parse(arg)", function(){

  it("parser should be backwards compatible", function(done){
    var res = uitmuntend.parse(testFile)
    res.should.be.an.Object.with.property('translations')
    res.translations.should.be.an.Array.which.is.not.empty
    res.translations[0].should.have.keys('original', 'translation')
    res.translations[0]['original'].should.containEql('search')
    res.translations[0]['translation'].should.containEql('Suche')
    done()
  })

  it("parser should parse as expected", function(done){
    var res = uitmuntend.parse(testFile)
    res.should.be.an.Object.with.property('results')
    res.results.should.be.an.Object.with.property('direkte Treffer')
    var res = res.results['direkte Treffer']
    res.should.be.an.Array
    res[0].should.have.keys('nl', 'de')
    res[0]['nl'].should.containEql('search')
    res[0]['de'].should.containEql('Suche')
    done()
  })
})

describe("search(arg, callback)", function(){

  // bad callback
  it("bad callback should return an error", function(done){
    uitmuntend.search().should.be.an.Error
    done()
  })

  // bad search arg
  it("bad arg should return and call back with an error", function(done){
    uitmuntend.search({}, function(res){
      res.should.be.an.Error
      return res
    }).should.be.an.Error
    done()
  })

  // futile search
  it("arg='xpqyz' should call back with an empty result set", function(done){
    return uitmuntend.search('xpqyz', function(res){
      res.should.be.an.Object.with.property('translations');
      res.translations.should.be.an.Array.which.is.empty;
      done();
    })
  })

  function trySearch(input, expectRes1, expectRes2){
    var expectRes = "'" + expectRes1 + "', '" + expectRes2 + "'"
    var exp = "results for '" + input + "' should contain: " + expectRes
    it(exp, function(done){
      return uitmuntend.search(input, function(res){
        res.should.be.an.Object.with.property('results')
        res.results.should.be.an.Object.with.property('direkte Treffer')
        var res = res.results['direkte Treffer']
        res.should.be.an.Array
        res[0].should.be.an.Object.with.keys('nl', 'de')
        res[0].nl.should.containEql(expectRes1)
        res[0].de.should.containEql(expectRes2)
        done()
      })
    })
  }

  trySearch('Gläser', 'potten', 'Glas')
  trySearch('zoektochten', 'zoektocht', 'Suche')

})

