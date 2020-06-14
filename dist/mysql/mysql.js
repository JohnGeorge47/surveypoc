"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _promise = _interopRequireDefault(require("mysql2/promise"));

var _config = _interopRequireDefault(require("../../config/config.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MySQL = function MySQL() {
  _classCallCheck(this, MySQL);

  this.connection = _promise["default"].createPool({
    host: "localhost",
    user: _config["default"].MYSQL_USERNAME,
    password: _config["default"].MYSQL_PASSWORD,
    database: _config["default"].MYSQL_DB,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
  });
};

var _default = MySQL;
exports["default"] = _default;