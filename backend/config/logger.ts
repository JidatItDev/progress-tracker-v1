import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ timestamp, level, message, stack }) => {
  if (stack) {
    return `${timestamp} ${level}: ${message}\n${stack}`;
  }
  return `${timestamp} ${level}: ${message}`;
});


const logger = winston.createLogger({
  level: 'info',  // Default level
  format: combine(
    timestamp(),
    colorize(),  // Adds color to log levels
    errors({ stack: true }), // Captures stack trace on error
    logFormat // Apply custom log format
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        logFormat
      ),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: combine(
        timestamp(),
        logFormat
      ),
    }),
  ],
});

export { logger };
