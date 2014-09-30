"use strict";

var _ = require('lodash')
  , cheerio = require('cheerio')
  , iconv = require('iconv-lite');

function parse(body) {

  var $ = cheerio.load(iconv.decode(body, 'iso-8859-1'))
  var res = {}
  var section = 'uncategorized'

  $('.t2 tbody tr').each(function(i, el){
    var childElems = $(this).children()
    var typeOfRow = _.pluck(childElems, 'name').toString()
    switch (typeOfRow) {
      case 'th':
        section = $(childElems).text()
        res[section] = res[section] || []
        break
      case 'td,td':
        res[section].push({
          nl: $(childElems[0]).text(),
          de: $(childElems[1]).text()
        })
        break
    }
  })

  var resSet = {
    results: res,
    translations: []
  }

  if (res['direkte Treffer']) {
    var oldStyle = []
    var translations = res['direkte Treffer']
    _.each(translations, function(value, key){
      oldStyle.push({
        original: value.nl,
        translation: value.de
      })
    })
    resSet.translations = oldStyle
  }
  
  return resSet

}

module.exports = parse
