"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _expressHttpContext = _interopRequireDefault(require("express-http-context"));

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

require("regenerator-runtime/runtime");

var app = (0, _express["default"])();
var startTime = new Date();
app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use(_expressHttpContext["default"].middleware);
app.use("/api", _routes["default"]);
app.get("/", function (req, res) {
  res.json({
    start_time: startTime,
    uptime: "".concat(Math.abs(startTime.getTime() - new Date().getTime()) / 1000, " seconds")
  });
});
var _default = app;
exports["default"] = _default;