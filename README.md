# unofficial scraper for uitmuntend.de

Node.js module for querying the [uitmuntend](http://www.uitmuntend.de/) 
German/Dutch dictionary.

## Installation

`npm install uitmuntend`

## Usage

```
var uitmuntend = require('uitmuntend');

var translations = uitmuntend.query('woord', function(res) {
  console.log(res);
});
```

## License

MIT

## Disclaimer

The author of this software is not affiliated with uitmuntend.de. Use at your
own risk.

