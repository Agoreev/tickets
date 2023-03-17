import express, {Request, Response} from 'express';
import { Ticket } from '../models/ticket';
import { appUrls } from './appUrls';

const router = express.Router();

router.get(appUrls.list, async (req: Request, res: Response) => {
    const tickets = await Ticket.find({ orderId: undefined });

    res.status(200).send(tickets);
});

export { router as listTicketsRouter };
