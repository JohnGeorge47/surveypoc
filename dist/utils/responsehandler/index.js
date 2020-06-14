"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResponseHandler = void 0;

var _factory = require("./factory");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ResponseHandler = /*#__PURE__*/function () {
  function ResponseHandler(rtype, method, rid) {
    _classCallCheck(this, ResponseHandler);

    if (rtype != _factory.JSON && rtype != _factory.XML) {
      // setting defaut type as JSON
      this.rtype = _factory.JSON;
    } else {
      this.rtype = rtype;
    }

    this.method = method;
    this.rid = rid;
  }

  _createClass(ResponseHandler, [{
    key: "success",
    value: function success(res, data, status) {
      if (status === undefined) {
        status = 200;
      }

      var fullResp = {
        http_code: status,
        metadata: this.method,
        method: this.method,
        request_id: this.rid,
        response: data
      };
      var responder = (0, _factory.GetResponseStrategy)(this.rtype);
      responder.send(res, fullResp, status);
    }
  }, {
    key: "error",
    value: function error(res, err, status) {
      if (status === undefined) {
        status = 400;
      }

      var fullResp = {
        http_code: err.code,
        metadata: this.method,
        method: this.method,
        request_id: this.rid,
        response: [{
          status: "error",
          code: err.code,
          error_data: {
            message: err.message
          }
        }]
      };
      var responder = (0, _factory.GetResponseStrategy)(this.rtype);
      responder.send(res, fullResp, status);
    }
  }]);

  return ResponseHandler;
}();

exports.ResponseHandler = ResponseHandler;
module.exports = {
  ResponseHandler: ResponseHandler
};