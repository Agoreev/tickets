import { OrderStatus } from '@artemgo-tickets/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { natsWrapper } from '../../nats-wrapper';
import { stripe } from '../../stripe';
import { getSignInCookie } from '../../test/auth-helper';
import Mock = jest.Mock;


it('returns a 404 when purchasing an order that doesnt exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', getSignInCookie())
        .send({
            token: 'dsfsdf',
            orderId: new mongoose.Types.ObjectId().toHexString(),
        })
        .expect(404);
});

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 10,
        status: OrderStatus.Created
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', getSignInCookie())
        .send({
            token: 'dsfsdf',
            orderId: order.id,
        })
        .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId,
        price: 10,
        status: OrderStatus.Cancelled
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', getSignInCookie(userId))
        .send({
            token: 'dsfsdf',
            orderId: order.id,
        })
        .expect(400);
});

it('returns a 201 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId,
        price,
        status: OrderStatus.Created
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', getSignInCookie(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id,
        })
        .expect(201);

    const recentCharges = await stripe.charges.list({ limit: 50 });
    const createdCharge = recentCharges.data.find(charge => charge.amount === price * 100);

    expect(createdCharge).toBeDefined();
    expect(createdCharge?.currency).toEqual('usd');

    const createdPayment = await Payment.findOne({ orderId: order.id, stripeId: createdCharge?.id });
    expect(createdPayment).not.toBeNull();

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
