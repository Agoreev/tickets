import { BadRequestError, validateRequest } from '@artemgo-tickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { Password } from '../services/password';
import { appUrls } from './appUrls';

const router = express.Router();

router.post(appUrls.sign_in,
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new BadRequestError('Invalid credentials');
        }

        const passwordMatched = await Password.compare(existingUser.password, password);
        if (!passwordMatched) {
            throw new BadRequestError('Invalid credentials');
        }

        const token =  jwt.sign({
            id: existingUser.id,
            email: existingUser.email,
        }, process.env.JWT_KEY!);

        req.session = {
            jwt: token
        };

        res.status(200).send(existingUser);
    }
);

export { router as signInRouter };
