"use strict";

var winston = require('winston');

var httpContext = require('express-http-context');

var createLogger = winston.createLogger,
    format = winston.format,
    transports = winston.transports;
var combine = format.combine,
    timestamp = format.timestamp,
    label = format.label,
    printf = format.printf;
var colorizer = winston.format.colorize();
var logTextFormat = winston.format.printf(function (_ref) {
  var level = _ref.level,
      message = _ref.message,
      label = _ref.label,
      timestamp = _ref.timestamp;
  return colorizer.colorize(level, "".concat(timestamp, " ").concat(httpContext.get('ctx') ? [httpContext.get('ctx')] : '', " [").concat(label, "] ").concat(level, ": ").concat(message));
});
var currentDate = new Date();
var date = currentDate.getDate().toString();
var month = currentDate.getMonth().toString();
var year = currentDate.getFullYear().toString();
var logFile = 'logs/' + date + '_' + month + '_' + year + '_app.log';
var logger = createLogger({
  format: combine(label({
    label: 'surveypoc'
  }), timestamp(), logTextFormat),
  transports: [new transports.Console(), new transports.File({
    filename: logFile
  })]
});
module.exports = console;