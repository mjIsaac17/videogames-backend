import { Request, Response } from "express";
import jwt from "../helpers/jwt.helper";
import log from "../logger";
import User from "../models/user.model";

const NAMESPACE = "User controller";

export const createUser = (req: Request, res: Response) => {
  //Creating a user add the admin role, this is temporarily
  const user = new User({ ...req.body, roleId: process.env.ADMIN_ROLE_ID });

  return user
    .save()
    .then((result) => {
      log.info(NAMESPACE, `New user ${user.email} added`);
      const { authToken, refreshToken } = jwt.generateTokens(
        result.id,
        result.name,
        result.roleId
      );

      return res.status(201).json({ user: result, authToken, refreshToken });
    })
    .catch((error) =>
      res.status(500).json({
        message: error.message,
        error,
      })
    );
};
