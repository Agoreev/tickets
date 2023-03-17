import { OrderCancelledEvent, OrderStatus } from '@artemgo-tickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 10,
        userId: 'dasfds',
        status: OrderStatus.Created,
        version: 0,
    });
    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: order.version + 1,
        ticket: {
            id: 'dfafdsaf',
        }
    }

    // @ts-ignore
    const message: Message = {
        ack: jest.fn(),
    }

    return { listener, order, data, message };
}

it('cancels the order', async () => {
    const { listener, data, message } = await setup();
    await listener.onMessage(data, message);

    const order = await Order.findById(data.id);
    expect(order?.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
    const { listener, data, message } = await setup();
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});
