"use strict";

var _expressHttpContext = _interopRequireDefault(require("express-http-context"));

var _responsehandler = _interopRequireDefault(require("../utils/responsehandler"));

var _survey_model = _interopRequireDefault(require("../models/survey_model"));

var _utils = _interopRequireDefault(require("../utils/utils"));

var _crypto = _interopRequireDefault(require("crypto"));

require("../models/users_model");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var survey_controller = {};
/*so the survey details api 
Im keeping in this format
{
    "title":"NameXYZ"
    "description":A gist of the survey basically
    "data":{
        //Heres the json about the survey
     "target":{
         "gender":
     }   
    }
}
*/

survey_controller.post = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var reqid, rp, reqbody, err, sm, val;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            reqid = _crypto["default"].randomBytes(16).toString('hex');

            _expressHttpContext["default"].set('ctx', reqid);

            rp = new _responsehandler["default"].ResponseHandler('application/json', 'post', _expressHttpContext["default"].get('ctx'));
            reqbody = req.body;

            if (_utils["default"].ValidateSurveyForm(reqbody)) {
              _context.next = 7;
              break;
            }

            err = new Error("Mandatory params are missing");
            return _context.abrupt("return", rp.error(res, err, 400));

          case 7:
            sm = new _survey_model["default"]();
            _context.prev = 8;
            _context.next = 11;
            return sm.CreateSurvey(reqbody.email_id, reqbody);

          case 11:
            val = _context.sent;
            return _context.abrupt("return", rp.success(res, val));

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](8);
            return _context.abrupt("return", rp.error(res, _context.t0, 404));

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[8, 15]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); //This can be changed into a post if there are privacy concerns becuse email is a param


survey_controller.get = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var reqid, rp, email_id, err, sm, result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            reqid = _crypto["default"].randomBytes(16).toString('hex');

            _expressHttpContext["default"].set('ctx', reqid);

            rp = new _responsehandler["default"].ResponseHandler('application/json', 'GET', _expressHttpContext["default"].get('ctx'));
            email_id = req.query.email_id;

            if (!(email_id == undefined)) {
              _context2.next = 7;
              break;
            }

            err = new Error("Mandatory params are missing");
            return _context2.abrupt("return", rp.error(res, err, 400));

          case 7:
            sm = new _survey_model["default"]();
            _context2.prev = 8;
            _context2.next = 11;
            return sm.BulkSurveyDetails(email_id);

          case 11:
            result = _context2.sent;
            return _context2.abrupt("return", rp.success(res, result, 200));

          case 15:
            _context2.prev = 15;
            _context2.t0 = _context2["catch"](8);
            throw _context2.t0;

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[8, 15]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

survey_controller.put = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var survey_id, reqid, rp, err, _err, _err2, sm;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            survey_id = req.params.survey_id;
            reqid = _crypto["default"].randomBytes(16).toString('hex');

            _expressHttpContext["default"].set('ctx', reqid);

            console.log(req.body.email_id);
            rp = new _responsehandler["default"].ResponseHandler('application/json', 'PUT', _expressHttpContext["default"].get('ctx'));

            if (!(!survey_id == undefined)) {
              _context3.next = 8;
              break;
            }

            err = new Error("Mandatory params are missing");
            return _context3.abrupt("return", rp.error(res, err, 400));

          case 8:
            if (req.body.hasOwnProperty('email_id')) {
              _context3.next = 11;
              break;
            }

            _err = new Error("Mandatory params are missing");
            return _context3.abrupt("return", rp.error(res, _err, 400));

          case 11:
            if (req.body.hasOwnProperty('response_json')) {
              _context3.next = 14;
              break;
            }

            _err2 = new Error("Mandatory params are missing");
            return _context3.abrupt("return", rp.error(res, _err2, 400));

          case 14:
            sm = new _survey_model["default"]();
            _context3.prev = 15;
            _context3.next = 18;
            return sm.UpdateSurvey(survey_id, req.body);

          case 18:
            return _context3.abrupt("return", rp.success(res, "Your changes have been recorded", 200));

          case 21:
            _context3.prev = 21;
            _context3.t0 = _context3["catch"](15);
            return _context3.abrupt("return", rp.error(res, _context3.t0, 400));

          case 24:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[15, 21]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

module.exports = survey_controller;