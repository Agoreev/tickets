import express from 'express';
import { appUrls } from './appUrls';

const router = express.Router();

router.post(appUrls.sign_out, (req, res) => {
    req.session = null;

    res.send({});
});

export { router as signOutRouter };
