import { BadRequestError, validateRequest } from '@artemgo-tickets/common';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';

import { User } from '../models/user';
import { appUrls } from './appUrls';

const router = express.Router();

router.post(
    appUrls.sign_up,
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be between 4 and 20 characters')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
       const { email, password } = req.body;

       const existingUser = await User.findOne({ email });

       if (existingUser) {
           throw new BadRequestError('Email already used');
       }

       const user = User.build({ email, password });
       await user.save();

       const token =  jwt.sign({
           id: user.id,
           email: user.email,
       }, process.env.JWT_KEY!);

       req.session = {
           jwt: token
       };

       res.status(201).send(user);
});

export { router as signUpRouter };
