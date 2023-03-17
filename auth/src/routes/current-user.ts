import { currentUser } from '@artemgo-tickets/common';
import express from 'express';

import { appUrls } from './appUrls';

const router = express.Router();

router.get(appUrls.current_user,
    currentUser,
    (req, res) => {
        res.send({ currentUser: req.currentUser || null });
    }
);

export { router as currentUserRouter };
