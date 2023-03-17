import { OrderCancelledEvent, Publisher, Subjects } from '@artemgo-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
