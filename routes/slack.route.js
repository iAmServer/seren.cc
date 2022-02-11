import Bot from '@slack/bolt';
import { InstallProvider } from '@slack/oauth';
import dotenv from 'dotenv';
import responseController from '../controllers/response.controller.js'
import installController from '../controllers/install.controller.js'

dotenv.config();

const receiver = new Bot.ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    endpoints: '/'
});

const installer = new InstallProvider({
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    stateSecret: process.env.SLACK_STATE_SECRET,
    installationStore: {
        storeInstallation: async (installation) => {
            if (installation.isEnterpriseInstall) {
                return await installController.insert({
                    enterpriseId: installation.enterprise.id,
                    installation
                });
            }else if(installation.team && installation.team.id){
                return await installController.insert({
                    teamId: installation.team.id,
                    installation
                });
            }

            throw new Error('Failed saving installtion data to installationStore');
        },
        fetchInstallation: async (installQuery) => {
            if (installQuery.isEnterpriseInstall) {
                if (installQuery.enterpriseId !== undefined) {
                    return await installController.getOne({ enterpriseId: installQuery.enterpriseId });
                }
            }

            if (installQuery.teamId !== undefined) {
                return await installController.getOne({teamId: installQuery.teamId})
            }

            throw new Error('Failed fetching installation')
        },
        deleteInstallation: async (installQuery) => {
            if (installQuery.isEnterpriseInstall) {
                if (installQuery.enterpriseId !== undefined) {
                    return await installController.remove({ enterpriseId: installQuery.enterpriseId });
                }
            }

            if (installQuery.teamId !== undefined) {
                return await installController.remove({ teamId: installQuery.teamId });
            }

            throw new Error('Failed to delete installation');
        }
    }
})

const botApp = new Bot.App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    receiver,
});

botApp.command('/bot', async ({ ack, body, context, respond }) => {
    await ack();

    await respond({
        token: context.botToken,
        response_type: 'in_channel',
        channel: body.channel_id,
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

botApp.action('user_feeling', async ({ body, ack, context, respond }) => {
    await ack();

    responseController.insert({
        question: 'Welcome. How are you doing?',
        user: body.user.id,
        response: body.actions[0].selected_option.value,
    });
    await respond({
        token: context.botToken,
        response_type: 'in_channel',
        channel: body.channel_id,
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

botApp.action('user_hobby', async ({ body, ack, context, respond }) => {
    await ack();

    responseController.insert({
        question: 'What are your favorite hobbies?',
        user: body.user.id,
        response: body.actions[0].selected_option.value,
    });
    await respond({
        token: context.botToken,
        response_type: 'in_channel',
        channel: body.channel_id,
        text: 'Thank you!'
    });
});

export default botApp;
export const router = receiver.router;
export const slackInstaller = installer;
