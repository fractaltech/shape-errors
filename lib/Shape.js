'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Promise based validation of input
 *

const Shape = require('shape-errors');
const s = new Shape({
  user_id: (userId) => userExists(userId).then((exists) => exists ? null : 'invalid'),
  name: (name, {user_id}) => findUserByName(name).then(
    (user) => user.id === user_id ? null : 'invalid'
  )
})

s.check(data).then(({result, errors}) => {})
*/

var _require = require('lodash');

var assign = _require.assign;
var toPlainObject = _require.toPlainObject;


var isUsableObject = require('isusableobject');

var Shape = function () {
  function Shape() {
    var validations = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, Shape);

    this.validations = new Map();

    this.addValidations(validations);
  }

  _createClass(Shape, [{
    key: 'addValidations',
    value: function addValidations() {
      var _this = this;

      var validations = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      if (isUsableObject(validations)) {
        validations = toPlainObject(validations);
        validations = Object.keys(validations).map(function (k) {
          return { key: k, validation: validations[k] };
        });
      }

      validations.forEach(function (_ref) {
        var key = _ref.key;
        var validation = _ref.validation;

        _this.validations.set(key, validation);
      });

      return this;
    }
  }, {
    key: 'addValidation',
    value: function addValidation(_ref2) {
      var key = _ref2.key;
      var validation = _ref2.validation;

      this.validations.set(key, validation);
      return this;
    }
  }, {
    key: 'merge',
    value: function merge(validator) {
      var _this2 = this;

      Array.from(validator.validation.keys()).forEach(function (k) {
        _this2.validations.set(k, validator.validations.get(k));
      });

      return this;
    }
  }, {
    key: 'errors',
    value: function errors() {
      var _this3 = this;

      var input = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return Promise.all(Array.from(this.validations.keys()).map(function (key) {
        var err = _this3.validations.get(key)(input[key], input, key);

        if (err instanceof Promise) {
          return err.then(function (err) {
            return { key: key, err: err };
          });
        } else if (err instanceof Shape) {
          return err.errors(input[key]).then(function (err) {
            return { key: key, err: err };
          });
        } else {
          return { key: key, err: err };
        }
      })).then(function (checks) {
        if (checks.filter(function (_ref3) {
          var err = _ref3.err;
          return !!err;
        }).length === 0) {
          return null;
        } else {
          return checks.reduce(function (all, _ref4) {
            var key = _ref4.key;
            var err = _ref4.err;

            return assign(all, _defineProperty({}, key, err));
          }, {});
        }
      });
    }
  }, {
    key: 'test',
    value: function test() {
      var _this4 = this;

      var input = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var invalidInputKeys = Object.keys(input).filter(function (k) {
        return _this4.validations.keys().indexOf(k) === -1;
      });

      if (invalidInputKeys.length > 0) {
        return Promise.reject(new (function (_Error) {
          _inherits(_class, _Error);

          function _class() {
            var items = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

            _classCallCheck(this, _class);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this, JSON.stringify(items), null, 2));
          }

          return _class;
        }(Error))(invalidInputKeys));
      } else {
        return this.errors(input).then(function (err) {
          if (err) {
            return Promise.reject(new (function (_Error2) {
              _inherits(_class2, _Error2);

              function _class2() {
                var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                _classCallCheck(this, _class2);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(_class2).call(this, JSON.stringify(data, null, 2)));
              }

              return _class2;
            }(Error))(err));
          }
        });
      }
    }
  }]);

  return Shape;
}();

module.exports = Shape;