import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import * as utils from "./utils.ts";
import process from "node:process";

const { combine, timestamp, simple, printf } = format;

const srrupLogFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

export const logger = createLogger({
  level: process.env.DEBUG || "info",
  format: combine(
    timestamp(),
    simple(),
    srrupLogFormat,
  ),
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    // - Also log to console
    //
    new transports.DailyRotateFile({
      level: "error",
      filename: `${utils.logFolder}/error-%DATE%.log`,
      zippedArchive: true,
      maxSize: "100m",
      maxFiles: "14d",
    }),
    new transports.DailyRotateFile({
      filename: `${utils.logFolder}/out-%DATE%.log`,
      zippedArchive: true,
      maxSize: "100m",
      maxFiles: "14d",
    }),
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.simple(),
        format.printf((info) =>
          `${info.timestamp} ${info.level}: ${info.message}`
        ),
      ),
    }),
  ],
});

export const debugLogger = createLogger({
  level: process.env.DEBUG || "info",
  format: combine(
    timestamp(),
    simple(),
    srrupLogFormat,
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.simple(),
        format.prettyPrint({ colorize: true, depth: 4 }),
        format.printf((debug) =>
          `${debug.timestamp} ${debug.level}: ${debug.message}`
        ),
      ),
    }),
  ],
});

export default logger;
