"use strict";

var should = require('should')
  , uitmuntend = require('../index.js');



describe("query(arg)", function(){

  // bad query
  it("arg='xpqyz' should call back with an empty result set", function(done){
    return uitmuntend.query('xpqyz', function(res){
      res.should.be.an.Object.with.property('translations');
      res.translations.should.be.an.Array.which.is.empty;
      done();
    })
  })

  // good query
  it("arg='woord' should call back with translations like 'Wort'", function(done){
    return uitmuntend.query('woord', function(res){
      res.should.be.an.Object.with.property('translations');
      res.translations.should.be.an.Array.which.is.not.empty;
      res.translations[0].should.have.keys('original', 'translation');
      res.translations[0]['original'].should.containEql('woord');
      res.translations[0]['translation'].should.containEql('Wort');
      done();
    })
  })

})

