import mongoose from 'mongoose';
import { app } from './app';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';


const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT key must be defined');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('Mongo URI key must be defined');
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }
    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }
    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        });

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCreatedListener(natsWrapper.client).listen();

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error(error);
    }
    console.log('Connected to mongodb');

    app.listen(3000, () => {
        console.log('Listening on 3000');
    });
}

start();

