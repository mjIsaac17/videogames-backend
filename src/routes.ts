import { Express, Request, Response } from 'express';

export default function (app: Express) {
    app.get('/videogames', (req: Request, res: Response) => res.sendStatus(200));
}