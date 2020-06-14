"use strict";

var _cluster = _interopRequireDefault(require("cluster"));

var _os = _interopRequireDefault(require("os"));

var _config = _interopRequireDefault(require("../config/config.json"));

var _app = _interopRequireDefault(require("./app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

require("regenerator-runtime/runtime");
/**
 * *Check if you're in the master process 
 */


if (_cluster["default"].isMaster) {
  var cpuCount = _os["default"].cpus().length;

  for (var i = 0; i < cpuCount; i++) {
    _cluster["default"].fork();
  }

  _cluster["default"].on('exit', function (worker) {
    console.log("Worker ".concat(worker.id, " died :("));

    _cluster["default"].fork();
  });
} else {
  _app["default"].listen(_config["default"].PORT, function (req, res) {
    console.log("Server listening on port: ".concat(_config["default"].PORT));
  });
}