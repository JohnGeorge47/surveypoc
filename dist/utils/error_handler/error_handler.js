"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var SurveyAppError = /*#__PURE__*/function (_Error) {
  _inherits(SurveyAppError, _Error);

  var _super = _createSuper(SurveyAppError);

  function SurveyAppError(message, id, status) {
    var _this;

    _classCallCheck(this, SurveyAppError);

    _this = _super.call(this);
    _this.name = _this.constructor.name;
    _this.code = status;
    _this.message = message;
    Error.captureStackTrace(_assertThisInitialized(_this), _this.constructor);
    return _this;
  }

  return SurveyAppError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

var MySQLErr = /*#__PURE__*/function (_SurveyAppError) {
  _inherits(MySQLErr, _SurveyAppError);

  var _super2 = _createSuper(MySQLErr);

  function MySQLErr(message, id, status) {
    _classCallCheck(this, MySQLErr);

    return _super2.call(this, message, id, 500);
  }

  return MySQLErr;
}(SurveyAppError);

var HttpErr = /*#__PURE__*/function (_SurveyAppError2) {
  _inherits(HttpErr, _SurveyAppError2);

  var _super3 = _createSuper(HttpErr);

  function HttpErr(message, id, status) {
    _classCallCheck(this, HttpErr);

    return _super3.call(this, message, id, status);
  }

  return HttpErr;
}(SurveyAppError);

var NoPermissionError = /*#__PURE__*/function (_SurveyAppError3) {
  _inherits(NoPermissionError, _SurveyAppError3);

  var _super4 = _createSuper(NoPermissionError);

  function NoPermissionError(message, id, status) {
    _classCallCheck(this, NoPermissionError);

    return _super4.call(this, message, id, 403);
  }

  return NoPermissionError;
}(SurveyAppError);

var UserDoesNotExist = /*#__PURE__*/function (_SurveyAppError4) {
  _inherits(UserDoesNotExist, _SurveyAppError4);

  var _super5 = _createSuper(UserDoesNotExist);

  function UserDoesNotExist(message, id, status) {
    _classCallCheck(this, UserDoesNotExist);

    return _super5.call(this, message, id, 404);
  }

  return UserDoesNotExist;
}(SurveyAppError);

module.exports = {
  SurveyAppError: SurveyAppError,
  MySQLErr: MySQLErr,
  HttpErr: HttpErr,
  NoPermissionError: NoPermissionError,
  UserDoesNotExist: UserDoesNotExist
};