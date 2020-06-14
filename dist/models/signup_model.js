"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mysql = _interopRequireDefault(require("../mysql/mysql"));

var _promise = _interopRequireDefault(require("mysql2/promise"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

require("regenerator-runtime/runtime");

var SignUpModel = /*#__PURE__*/function (_MySQL) {
  _inherits(SignUpModel, _MySQL);

  var _super = _createSuper(SignUpModel);

  function SignUpModel() {
    _classCallCheck(this, SignUpModel);

    return _super.call(this);
  }

  _createClass(SignUpModel, [{
    key: "Signup",
    value: function () {
      var _Signup = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(body) {
        var query1, inserts, query2, conn, results, lastinsert, query2inserts, res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                //I'm adding a transaction her i feel its not he best way to go about this should be ideally put
                //in the mysql module
                query1 = "INSERT INTO users(email_id,age,gender,user_type) VALUES(?,?,?,?)";
                inserts = [body.email_id, body.age, body.gender, body.user_type];
                query2 = "INSERT INTO passwords(email_id,user_id,password) VALUES(?,?,?)";
                _context.next = 5;
                return this.connection.getConnection();

              case 5:
                conn = _context.sent;
                _context.next = 8;
                return conn.beginTransaction();

              case 8:
                _context.prev = 8;
                _context.next = 11;
                return conn.query(query1, inserts);

              case 11:
                results = _context.sent;
                lastinsert = results[0].insertId;
                console.log(lastinsert);
                query2inserts = [body.email_id, lastinsert, body.password];
                _context.next = 17;
                return conn.query(query2, query2inserts);

              case 17:
                res = _context.sent;
                _context.next = 20;
                return conn.commit();

              case 20:
                _context.next = 27;
                break;

              case 22:
                _context.prev = 22;
                _context.t0 = _context["catch"](8);
                _context.next = 26;
                return conn.rollback();

              case 26:
                throw _context.t0;

              case 27:
                _context.prev = 27;
                conn.release();
                return _context.finish(27);

              case 30:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[8, 22, 27, 30]]);
      }));

      function Signup(_x) {
        return _Signup.apply(this, arguments);
      }

      return Signup;
    }()
  }]);

  return SignUpModel;
}(_mysql["default"]);

var _default = SignUpModel;
exports["default"] = _default;