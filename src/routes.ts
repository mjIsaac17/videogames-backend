import { Express, Request, Response } from 'express';
import { createUserHandler } from './controllers/user.controller';
import validateRequest from './middlewares/validateRequests';
import { createUserSchema } from './schemas/user.schema';

export default function (app: Express) {
    app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200));

    app.post('/api/users', validateRequest(createUserSchema), createUserHandler);
}