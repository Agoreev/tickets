import { Publisher, Subjects, TicketCreatedEvent, TicketUpdatedEvent } from '@artemgo-tickets/common';


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
