import dotenv from 'dotenv';
import express from 'express';

import index from './routes/index.route.js';
import { router, slackInstaller } from './routes/slack.route.js';
import {Connect} from './db-conn.js';

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use('/', index);
app.use('/slack', router);

app.get('/slack/install', async (req, res) => {
    const link = await slackInstaller.generateInstallUrl({
        scopes: ['app_mentions:read', 'channels:history', 'channels:join', 'channels:read', 'chat:write', 'chat:write.customize', 'chat:write.public', 'commands', 'dnd:read', 'groups:history', 'im:read', 'im:write', 'mpim:history', 'mpim:read', 'mpim:write', 'users.profile:read', 'users:read', 'channels:manage', 'groups:read', 'groups:write', 'im:history', 'incoming-webhook'],
        userScopes: ['channels:read', 'groups:read', 'im:history', 'im:read', 'users:read'],
        metadata: 'Seren',
        redirectUri: 'https://8f2e-102-89-34-217.ngrok.io/slack/auth/callback'
    });

    res.status(200).send(link);
});

app.get('/slack/auth/callback', async (req, res) => {
    await slackInstaller.handleCallback(req, res);
});

const server = app.listen(port, async (err, res) => {
    if (!err) {
        console.log(`Server listening on port ${port}`);
        await Connect();
    }
});

export { app, server };
