import supertest from 'supertest';
import responseController from "../controllers/response.controller";
import { app, server } from '../app';

const request = supertest(app);
import { Disconnect } from '../db-conn';

describe('API test', () => {
    afterAll(async () => {
        await Disconnect();
        server.close();
    });

    describe('GET /slack/install', () => {
        it('get slack connect installation link', async () => {
            const res = await request.get('/slack/install');

            expect(res.status).toBe(200);
        });
    });

    describe('GET /installs', () => {
        it('get all installs', async () => {
            const res = await request.get('/installs');

            expect(res.status).toBe(200);
            expect(res.body.data).toBeDefined();
        });
    });

    describe('GET /retrieve', () => {
        it('get all responses', async () => {
            const res = await request.get('/retrieve');

            expect(res.status).toBe(200);
            expect(res.body.data).toBeDefined();
        });
    });

    describe('GET /retrieve?usersOnly=true&responsesOnly=true&user=U4Y3GKGF9', () => {
        it('get reponses with all query parameters', async () => {
            const res = await request.get('/retrieve?usersOnly=true&responsesOnly=true&user=U4Y3GKGF9');

            expect(res.status).toBe(400);
        });
    });

    describe('GET /retrieve?usersOnly', () => {
        it('get ids of users that have interacted with the bot', async () => {
            const res = await request.get('/retrieve?usersOnly');

            expect(res.status).toBe(200);
            expect(res.body.data).toBeDefined();
        });
    });

    describe('Insert into response collection', () => {
        it('should insert a response into the database', async () => {
            try {
                await responseController.insert({
                    question: 'What are your favorite hobbies?',
                    user: 'U4Y3GKGF9',
                    response: 'Football'
                }).then(async (resp) => {
                    const res = await request.get('/retrieve');

                    expect(res.status).toBe(200);
                });
            } catch (e) {
                expect(e).toBeUndefined();
            }
        });
    });
});