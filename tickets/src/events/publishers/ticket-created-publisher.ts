import { Publisher, Subjects, TicketCreatedEvent } from '@artemgo-tickets/common';


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
