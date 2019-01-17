const tape = require('tape');
const shape = require('../lib');

tape('shape-errors invalid-keys', async (t) => {
  t.plan(1);

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

  t.equal(errors.fizz, 'invalid key');
});
