const winston = require('winston')
const httpContext = require('express-http-context')
const { createLogger, format, transports } = winston
const { combine, timestamp, label, printf } = format
const colorizer = winston.format.colorize()

const logTextFormat = winston.format.printf(
  ({ level, message, label, timestamp }) =>
    colorizer.colorize(
      level,
      `${timestamp} ${
        httpContext.get('ctx') ? [httpContext.get('ctx')] : ''
      } [${label}] ${level}: ${message}`
    )
)

var currentDate = new Date()
var date = currentDate.getDate().toString()
var month = currentDate.getMonth().toString()
var year = currentDate.getFullYear().toString()
let logFile = 'logs/' + date + '_' + month + '_' + year + '_app.log'

const logger = createLogger({
  format: combine(
    label({
      label: 'surveypoc',
    }),
    timestamp(),
    logTextFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: logFile,
    }),
  ],
})
module.exports = console
