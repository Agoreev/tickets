import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import { getSignInCookie } from '../../test/auth-helper';
import { appUrls } from '../appUrls';

it('returns a 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', getSignInCookie())
        .send({
            title: '1234',
            price: 10,
        })
        .expect(404);
});

it('returns a 401 if the user is not authenticated to update this ticket', async () => {
    const title = '123';
    const price = 10;

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', getSignInCookie())
        .send({
            title, price
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', getSignInCookie())
        .send({
            title: '43324',
            price: 343,
        })
        .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
    const title = '123';
    const price = 10;

    const cookie = getSignInCookie();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title, price
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '123',
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            price: 10,
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '123',
            price: -10,
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
        })
        .expect(400);
});

it('rejects the ticket update if it was reserved', async () => {
    const title = '123';
    const price = 10;

    const expectedTitle = '434243';
    const expectedPrice = 23;
    const cookie = getSignInCookie();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title, price
        })
        .expect(201);

    const ticket = await Ticket.findById(response.body.id);
    ticket?.set({ orderId: new mongoose.Types.ObjectId().toHexString()})
    await ticket?.save();

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: expectedTitle,
            price: expectedPrice,
        })
        .expect(400);
});

it('updated the ticket if valid inputs are provided', async () => {
    const title = '123';
    const price = 10;

    const expectedTitle = '434243';
    const expectedPrice = 23;
    const cookie = getSignInCookie();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title, price
        })
        .expect(201);

    const updatedTicket = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: expectedTitle,
            price: expectedPrice,
        })
        .expect(200);

    const updatedFromDb = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send();

    expect(updatedTicket.body.title).toEqual(expectedTitle);
    expect(updatedTicket.body.price).toEqual(expectedPrice);
    expect(updatedFromDb.body.title).toEqual(expectedTitle);
    expect(updatedFromDb.body.price).toEqual(expectedPrice);
});

it('publishes an event', async () => {
    const title = '123';
    const price = 10;

    const expectedTitle = '434243';
    const expectedPrice = 23;
    const cookie = getSignInCookie();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title, price
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: expectedTitle,
            price: expectedPrice,
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
