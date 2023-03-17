import request from 'supertest';
import { app } from '../../app';
import { getSignInCookie } from '../../test/auth-helper';
import { appUrls } from '../appUrls';

it('should responds with details about the current user', async () => {
    const cookie = await getSignInCookie();

    const response = await request(app)
        .get(appUrls.current_user)
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(response.body.currentUser?.email).toEqual('test@test.com');
});

it('should responds with null if not authenticated', async () => {

    const response = await request(app)
        .get(appUrls.current_user)
        .send()
        .expect(200);

    expect(response.body.currentUser).toBeNull();
});
