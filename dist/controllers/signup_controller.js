"use strict";

var _crypto = _interopRequireDefault(require("crypto"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _expressHttpContext = _interopRequireDefault(require("express-http-context"));

var _responsehandler = _interopRequireDefault(require("../utils/responsehandler"));

var _utils = _interopRequireDefault(require("../utils/utils"));

var _signup_model = _interopRequireDefault(require("../models/signup_model"));

require("regenerator-runtime/runtime.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var signup_controller = {};
var saltrounds = 10;

signup_controller.post = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var reqid, rp, reqbody, err, hash, sm, responseData;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            reqid = _crypto["default"].randomBytes(16).toString('hex');

            _expressHttpContext["default"].set('ctx', reqid);

            rp = new _responsehandler["default"].ResponseHandler('application/json', 'post', _expressHttpContext["default"].get('exoCtx'));
            reqbody = req.body;
            console.log(req.body);

            if (_utils["default"].FormValidation(reqbody)) {
              _context.next = 8;
              break;
            }

            err = new Error("Some parameters are missing");
            return _context.abrupt("return", rp.error(res, err, 400));

          case 8:
            _context.prev = 8;
            _context.next = 11;
            return _bcrypt["default"].hash(req.body.password, saltrounds);

          case 11:
            hash = _context.sent;
            req.body.password = hash;
            sm = new _signup_model["default"]();
            _context.next = 16;
            return sm.Signup(req.body);

          case 16:
            responseData = {
              "success": "ok"
            };
            return _context.abrupt("return", rp.success(res, responseData));

          case 20:
            _context.prev = 20;
            _context.t0 = _context["catch"](8);
            return _context.abrupt("return", rp.error(res, _context.t0, 400));

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[8, 20]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = signup_controller;