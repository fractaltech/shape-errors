const assert = require('assert');
const shape = require('../lib');

(async () => {
  console.log('testing shape invalid-keys');

  const data = {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz',
    fizz: 'buzz'
  };

  const validation = shape({
    foo: (foo) => foo === 'foo' ? null : 'invalid',
    bar: (bar) => bar === 'bar' ? null : 'invalid',
    baz: (baz) => baz === 'baz' ? null : 'invalid'
  });

  const errors = await validation.errors(data);

  assert.ok(errors.fizz === 'invalid key');

  console.log('it works');
})();
