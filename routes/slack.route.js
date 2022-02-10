import { ExpressReceiver, App, LogLevel } from "@slack/bolt";

const receiver = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    endpoints: '/'
});

export const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    receiver,
    logLevel: LogLevel.DEBUG
});

export const router = receiver.router;