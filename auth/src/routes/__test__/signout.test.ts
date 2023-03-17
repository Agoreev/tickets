import request from 'supertest';
import { app } from '../../app';
import { appUrls } from '../appUrls';

it('clears the cookie after signing in', async () => {
    await request(app)
        .post(appUrls.sign_up)
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201);

    const response = await request(app)
        .post(appUrls.sign_out)
        .send({})
        .expect(200);

    expect(response.get('Set-Cookie')[0]).toEqual(
        'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    );
});
