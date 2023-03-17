import mongoose from 'mongoose';
import { app } from './app';


const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT key must be defined');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('Mongo URI key must be defined');
    }
    try {
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

