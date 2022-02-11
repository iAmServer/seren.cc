import { Connect, Disconnect } from '../db-conn';

describe('DB Connection Test', () => {

    it('should connect to mongodb', async () => {
        const db = await Connect();
        
        expect(db.connection.host).toBeDefined();
        expect(db.connection.port).toBeDefined();
        await Disconnect();
    });
});