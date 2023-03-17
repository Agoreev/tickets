import { NotFoundError } from '@artemgo-tickets/common';
import express, {Request, Response} from 'express';
import { Ticket } from '../models/ticket';
import { appUrls } from './appUrls';

const router = express.Router();

router.get(appUrls.show, async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        throw new NotFoundError();
    }

    res.status(200).send(ticket);
});

export { router as showTicketRouter };
