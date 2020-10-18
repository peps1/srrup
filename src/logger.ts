import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import * as utils from './utils';

const logger = createLogger({
    level: process.env.DEBUG || 'info',
    format: format.combine(
        format.timestamp(),
        format.simple(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        // - Also log to console
        //
        new transports.DailyRotateFile({
            level: 'error',
            filename: `${utils.logFolder}/error-%DATE%.log`,
            zippedArchive: true,
            maxSize: '100m',
            maxFiles: '14d'
        }),
        new transports.DailyRotateFile({
            filename: `${utils.logFolder}/out-%DATE%.log`,
            zippedArchive: true,
            maxSize: '100m',
            maxFiles: '14d'
        }),
        new transports.Console({
            format: format.combine(
                format.timestamp(),
                format.colorize(),
                format.simple(),
                format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
            )
        })
    ],
});

export default logger;