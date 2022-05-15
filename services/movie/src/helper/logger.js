const WinstonDailyRotateFile = require('winston-daily-rotate-file');
const { createLogger, format, transports } = require('winston');
const { resolve } = require('path');
const { isDevelopment } = require('../config');

// use for production
const fileLogger = createLogger({
	format: format.combine(
		format.timestamp(),
		format.align(),
		format.prettyPrint(),
		format.printf(
			info =>
				`${info.timestamp} ${info.level} [${info.label}]:\n\n ${info.message} \n\n\n`
		)
	),
	transports: [
		new WinstonDailyRotateFile({
			filename: resolve(__dirname, '../logs/error-%DATE%.log'),
			level: 'error',
		}),
	],
});

// error will not log on the console in the production environment
if (isDevelopment) {
	fileLogger.add(
		new transports.Console({
			format: format.combine(
				format.timestamp(),
				format.colorize(),
				format.printf(
					info =>
						`${info.timestamp} ${info.level}  [${info.label}]: ${info.message}`
				)
			),
		})
	);
}

const Console = createLogger({
	transports: new transports.Console({
		format: format.combine(
			format.timestamp(),
			format.colorize(),
			format.printf(
				info => `${new Date(info.timestamp)} ${info.level}: ${info.message}`
			)
		),
	}),
});

module.exports = { fileLogger, Console };