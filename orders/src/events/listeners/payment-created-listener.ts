import { Listener, NotFoundError, OrderStatus, PaymentCreatedEvent, Subjects } from '@artemgo-tickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const { orderId } = data;

        const order = await Order.findById(orderId);
        if (!order) {
            throw new NotFoundError();
        }

        order.set({ status: OrderStatus.Complete });
        await order.save();

        msg.ack();
    }
}
