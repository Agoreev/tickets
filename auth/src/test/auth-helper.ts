import request from 'supertest';
import { app } from '../app';
import { appUrls } from '../routes/appUrls';

export const getSignInCookie = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
        .post(appUrls.sign_up)
        .send({
            email, password
        })
        .expect(201);

    const cookie = response.get('Set-Cookie');

    return cookie;
}
