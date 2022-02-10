import Bot from '@slack/bolt';
import dotenv from 'dotenv';
import responseController from '../controllers/response.controller.js'

dotenv.config();

const receiver = new Bot.ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    endpoints: '/'
});

const botApp = new Bot.App({
    token: process.env.SLACK_BOT_TOKEN,
    receiver,
    logLevel: Bot.LogLevel.DEBUG,
});

botApp.command('/bot', async ({ ack, body, say }) => {
    await ack();

    await say({
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `Welcome. How are you doing?`
                },
                accessory: {
                    action_id: "user_feeling",
                    type: "static_select",
                    placeholder: {
                        type: "plain_text",
                        text: "Select how you are feeling..."
                    },
                    focus_on_load: true,
                    options: [
                        {
                            text: {
                                type: "plain_text",
                                text: "Doing Well"
                            },
                            value: "Doing Well"
                        },
                        {
                            text: {
                                type: "plain_text",
                                text: "Neutral"
                            },
                            value: "Neutral"
                        },
                        {
                            text: {
                                type: "plain_text",
                                text: "Feeling Lucky"
                            },
                            value: "Feeling Lucky"
                        }
                    ]
                }
            }
        ], 
    });
});

botApp.action('user_feeling', async ({ body, ack, say }) => {
    await ack();

    responseController.insert({
        question: 'Welcome. How are you doing?',
        user: body.user.id,
        response: body.actions[0].selected_option.value,
    });
    await say({
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `What are your favorite hobbies?`
                },
                accessory: {
                    action_id: "user_hobby",
                    type: "static_select",
                    placeholder: {
                        type: "plain_text",
                        text: "Select your hobby"
                    },
                    focus_on_load: true,
                    options: [
                        {
                            text: {
                                type: "plain_text",
                                text: "Football"
                            },
                            value: "Football"
                        },
                        {
                            text: {
                                type: "plain_text",
                                text: "Music"
                            },
                            value: "Music"
                        },
                        {
                            text: {
                                type: "plain_text",
                                text: "Sleep"
                            },
                            value: "Sleep"
                        },
                        {
                            text: {
                                type: "plain_text",
                                text: "Movies"
                            },
                            value: "Movies"
                        },
                        {
                            text: {
                                type: "plain_text",
                                text: "Basketball"
                            },
                            value: "Basketball"
                        },
                    ]
                }
            }
        ], 
    });
});

botApp.action('user_hobby', async ({ body, ack, say }) => {
    await ack();

    responseController.insert({
        question: 'What are your favorite hobbies?',
        user: body.user.id,
        response: body.actions[0].selected_option.value,
    });
    await say("Thank you");
});

export default botApp;
export const router = receiver.router;