import { Listener, Subjects, TicketCreatedEvent } from '@artemgo-tickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';


export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
        const { title, price, id } = data;
        const ticket = Ticket.build({
            title, price, id
        });
        await ticket.save();

        msg.ack();
    }
}
