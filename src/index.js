const Shape = require('./Shape');

function shape(...args) {
  return new Shape(...args);
}

module.exports = shape;
