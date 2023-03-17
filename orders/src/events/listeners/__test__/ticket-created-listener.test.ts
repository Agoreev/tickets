import { TicketCreatedEvent } from '@artemgo-tickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // create a fake data event
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
    };

    // create a fake message object
    // @ts-ignore
    const message: Message = {
        ack: jest.fn(),
    }

    return { listener, data, message };
}

it('creates and saves a ticket', async () => {
    const { listener, message, data } = await setup();
    // call the onMessage function with data object + message object
    await listener.onMessage(data, message);

    // write assertions to make sure a ticket was created
    const createdTicket = await Ticket.findById(data.id);

    expect(createdTicket).toBeDefined();
    expect(createdTicket?.title).toEqual(data.title);
    expect(createdTicket?.price).toEqual(data.price);
});

it('acks the message', async () => {
    const { listener, message, data } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});

