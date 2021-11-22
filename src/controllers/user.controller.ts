import { Request, Response } from "express";
import { sign } from "../helpers/jwt.helper";
import log from "../logger";
import User from "../models/user.model";

const NAMESPACE = "User controller";

export const createUser = async (req: Request, res: Response) => {
  const user = new User(req.body);

  return user
    .save()
    .then((result) => {
      log.info(NAMESPACE, `New user ${user.email} added`);
      const token = sign(
        { id: result.id, name: result.name },
        { expiresIn: "20m" }
      );
      return res.status(201).json({ user: result, token });
    })
    .catch((error) =>
      res.status(500).json({
        message: error.message,
        error,
      })
    );
};
