"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetResponseStrategy = void 0;

var _json = _interopRequireDefault(require("./json"));

var _xml = _interopRequireDefault(require("./xml"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var JSON = "application/json";
var XML = "text/xml";

var GetResponseStrategy = function GetResponseStrategy(rtype) {
  switch (rtype) {
    case JSON:
      var jsonObj = new _json["default"].JSONStrategy();
      return jsonObj;

    case XML:
      return new _xml["default"].XMLStrategy();
  }

  return JSONStrategy;
};

exports.GetResponseStrategy = GetResponseStrategy;
module.exports = {
  GetResponseStrategy: GetResponseStrategy,
  XML: XML,
  JSON: JSON
};