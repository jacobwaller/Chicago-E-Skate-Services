import { Context, Telegraf } from 'telegraf';
import winston from "winston";
import Transport from 'winston-transport'
import { LOGGING_GROUP_ID } from '../utils/ids';

const { BOT_TOKEN } = process.env;
const bot = new Telegraf(BOT_TOKEN || '');

class TelegramMessageTransport extends Transport {
    constructor(opts?: winston.transport.TransportStreamOptions) {
        super(opts);
    }

    log(info: unknown, callback: () => void) {
        const ctx = bot.context as Partial<Context>;
        try {
            const strRep = JSON.stringify(info);
            bot.telegram.sendMessage(LOGGING_GROUP_ID, strRep);
        } finally {
            callback();
        }
    }
};

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
        }),
        new TelegramMessageTransport(),
    ],
});



export default logger;