import { Request, Response } from "express";
import log from "../logger";
import { createUser } from "../services/user.service"

export const createUserHandler = async (req: Request, res: Response) => {
    try {
        const user = await createUser(req.body);
        return res.send(user);
    } catch (error: any) {
        log.error(error);
        return res.status(409).send(error.message)
    }
}