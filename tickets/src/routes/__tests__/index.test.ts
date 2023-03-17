import request from 'supertest';
import { app } from '../../app';
import { getSignInCookie } from '../../test/auth-helper';

const createTicket = () => request(app)
    .post('/api/tickets')
    .set('Cookie', getSignInCookie())
    .send({
        title: 'dsfadsf',
        price: 20,
    });

it('can fetch a list of tickets', async () => {
   await createTicket();
   await createTicket();
   await createTicket();

   const response = await request(app)
       .get('/api/tickets')
       .send()
       .expect(200);

   expect(response.body.length).toEqual(3);
});
