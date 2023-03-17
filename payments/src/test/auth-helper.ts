import { sign } from 'jsonwebtoken';
import mongoose from 'mongoose';

export const getSignInCookie = (userId?: string) => {
    const payload = {
        id: userId ?? new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    };

    const token = sign(payload, process.env.JWT_KEY!);

    const session = { jwt: token };

    const sessionJSON = JSON.stringify(session);

    const base64 = Buffer.from(sessionJSON).toString('base64');

    return [`session=${base64}`];

}
