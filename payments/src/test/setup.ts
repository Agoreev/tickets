import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

jest.mock('../nats-wrapper');

let mongo: any;

process.env.STRIPE_KEY = 'sk_test_51MkBkhIsIElS5uPPq6uem3pePcLBzIE34LscQ9yP56GqJFSj1h7MgXeJ9HiBzxD8hlkt1KXsvOwyQutGjRdIpy2k00hJraskl5';

beforeAll(async () => {
    process.env.JWT_KEY = 'asdfasdf';

    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
})
