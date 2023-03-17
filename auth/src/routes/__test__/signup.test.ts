import request from 'supertest';
import { app } from '../../app';
import { appUrls } from '../appUrls';

it('should returns a 201 on successful signup', async () => {
    return request(app)
        .post(appUrls.sign_up)
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201);
});

it('should returns 400 on invalid email', async () => {
    return request(app)
        .post(appUrls.sign_up)
        .send({
            email: 'test',
            password: 'password',
        })
        .expect(400);
});

it('should returns 400 on invalid password', async () => {
    return request(app)
        .post(appUrls.sign_up)
        .send({
            email: 'test@mail.ru',
            password: 'p',
        })
        .expect(400);
});

it('should returns 400 with missing email and password', async () => {
    return request(app)
        .post(appUrls.sign_up)
        .send({
            email: '',
            password: '',
        })
        .expect(400);
});

it('should disallows duplicate emails', async () => {
    await request(app)
        .post(appUrls.sign_up)
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201);

    return request(app)
        .post(appUrls.sign_up)
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(400);
});

it('should sets a cookie after successful signup', async () => {
    const response = await request(app)
        .post(appUrls.sign_up)
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});
