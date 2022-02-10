import dotenv from 'dotenv';
import express from 'express';
import createError from 'http-errors';
import logger from 'morgan';
import mongoose from 'mongoose';

import index from './routes/index.route.js';
import {router} from './routes/slack.route.js';
import responseController from './controllers/response.controller.js';

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(logger('dev'));

app.use('/', index);
app.use(`/slack`, router);

app.use((req, res, next) => {
  next(createError(404));
});

app.listen(port, (err, res) => {
    if (err) {
        console.log(err);
    } else {
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err, res) => {
            if (err) {
                console.log('server started but unable to connected mongodb');
            } else {
                console.log('server started and connected to mongodb');
            }
        });
    }
});