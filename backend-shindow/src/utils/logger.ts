import { createLogger, format, transports } from "winston";
import moment from "moment-timezone";
import path from "path";
import { DEFAULT_TZ } from "../constants";

const timezone = process.env.TZ || DEFAULT_TZ;
const rootPath = path.resolve(process.cwd());

/**Logger setup for winston, logs are saved to /src/logs, the timezone is obtained from environment*/
const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: () => moment().tz(timezone).format(),
    }),
    format.printf(
      (info) => `[${info.timestamp}] [${info.level}]: ${info.message}`
    )
  ),
  transports: [
    new transports.File({
      level: "info",
      maxsize: 5120000,
      maxFiles: 5,
      filename: `${rootPath}/src/logs/info.log`,
    }),
    new transports.File({
      level: "error",
      maxsize: 5120000,
      maxFiles: 5,
      filename: `${rootPath}/src/logs/error.log`,
    }),
    new transports.File({
      level: "warn",
      maxsize: 5120000,
      maxFiles: 5,
      filename: `${rootPath}/src/logs/warn.log`,
    }),
    new transports.Console({
      level: "debug",
    }),
  ],
});

export default logger;
