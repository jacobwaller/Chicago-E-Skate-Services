import winston from "winston";

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'bot' },
    transports: [
        new winston.transports.Console({
            format: winston.format.printf(({ level, message, ...meta }) => {
              const msg = typeof message === "string" ? message : JSON.stringify(message);
              const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
              return `${level}: ${msg}${metaStr}`;
            })
          })
    ],
  });

export default logger;