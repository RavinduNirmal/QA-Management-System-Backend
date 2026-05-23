const winston = require("winston");
require("winston-daily-rotate-file");

const { combine, timestamp, json } = winston.format;

let env = process.env.NODE_ENV || "production";
// if (!env) env = "development";

let custFormat = winston.format.combine(
  winston.format.label({
    label: "--------QA Managemenent System------",
  }),
  winston.format.timestamp({
    format: "YY-MM-DD HH-mm-SS",
  }),
  winston.format.printf(
    (info: any) => `${info.label} ${info.level} ${info.timestamp} ${info.message} `
  )
  //winston.format.json()
);

let logger = winston.createLogger({
  format: winston.format.combine(),
});

if (env === "production") {
  const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: "logs/ecr-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    level: "info",
    zippedArchive: true,
    maxSize: "5m",
    maxFiles: "30d",
    auditFile: "log-audit.json",
  });

  const consoleTransport = new winston.transports.Console({ level: "info", format: custFormat });

  logger = winston.createLogger({
    //level: process.env.LOG_LEVEL || "info",
    format: combine(
      timestamp(),
      winston.format.label({
        label: "--------QA Managemenent System------",
      }),
      json()
    ),
    transports: [fileRotateTransport],
  });
} else if (env == "development") {
  logger.add(new winston.transports.Console({ level: "info", format: custFormat }));
  logger.add(new winston.transports.Console({ level: "error", colorize: custFormat }));
}

process.on("uncaughtException", (err) => {
  console.log(err);
  logger.error(err);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  logger.error(err);
});

function logLine(msg: string) {
  console.log(msg);
}

module.exports.logLine = logLine;
export default logger;






