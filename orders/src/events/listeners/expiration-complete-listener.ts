import { ExpirationCompleteEvent, Listener, NotFoundError, OrderStatus, Subjects } from '@artemgo-tickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { queueGroupName } from './queue-group-name';


export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        const { orderId } = data;
        const order = await Order.findById(orderId).populate('ticket');
        if (!order) {
            throw new NotFoundError();
        }
        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            ticket: {
                id: order.ticket.id,
            },
            version: order.version
        });

        msg.ack();
    }

}
