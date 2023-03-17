import request from 'supertest';
import { app } from '../../app';
import { appUrls } from '../appUrls';

it('should fail when an email that does not exist is supplied', async () => {
    await request(app)
        .post(appUrls.sign_in)
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
    await request(app)
        .post(appUrls.sign_up)
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201);

    await request(app)
        .post(appUrls.sign_in)
        .send({
            email: 'test@test.com',
            password: 'asdfadsf',
        })
        .expect(400);
});

it('response with a cookie when given valid credentials', async () => {
    await request(app)
        .post(appUrls.sign_up)
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201);

    const response = await request(app)
        .post(appUrls.sign_in)
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
});
