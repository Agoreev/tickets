import { PaymentCreatedEvent, Publisher, Subjects } from '@artemgo-tickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
