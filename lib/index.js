'use strict';

var Shape = require('./Shape');

function shape() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(Shape, [null].concat(args)))();
}

module.exports = shape;