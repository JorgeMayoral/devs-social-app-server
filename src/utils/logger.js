const winston = require('winston');
require('winston-daily-rotate-file');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || 'develppment';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'http';
};

const logFormat = winston.format.printf(
  (info) => `${info.timestamp} - [${info.level}] - ${info.message}`,
);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
);

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(logFormat),
  }),
  new winston.transports.DailyRotateFile({
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    format: winston.format.combine(winston.format.json()),
  }),
];

const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

module.exports = Logger;
