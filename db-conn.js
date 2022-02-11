import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();
let mongodb = null;

const Connect = async () => {
    try {
        let dbUri = process.env.MONGODB_URI;

        if (process.env.NODE_ENV === 'test') {
            mongodb = await MongoMemoryServer.create();
            dbUri = mongodb.getUri();
        }

        const db = await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to ' + db.connection.host);
        return db;
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

const Disconnect = async () => {
    try {
        await mongoose.connection.close();
        if (mongodb) {
            await mongodb.stop();
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export { Connect, Disconnect };