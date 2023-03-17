import { TicketUpdatedEvent } from '@artemgo-tickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
    });
    await ticket.save();

    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: 'concert 2',
        price: 20,
        version: ticket.version + 1,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }

    // @ts-ignore
    const message: Message = {
        ack: jest.fn(),
    };

    return { listener, data, ticket, message };
}

it('finds updates and saves a ticket', async () => {
    const { message, listener, data, ticket } = await setup();

    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket?.version).toEqual(data.version);
    expect(updatedTicket?.title).toEqual(data.title);
    expect(updatedTicket?.price).toEqual(data.price);
});

it('acks the message', async () => {
    const { message, data, listener } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});

it('doesnt call ack if the event has a skipped version number', async () => {
    const { message, data, listener } = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, message);
    } catch (err) {

    }

    expect(message.ack).not.toHaveBeenCalled();
});
