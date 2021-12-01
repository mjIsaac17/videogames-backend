import { Request, Response } from "express";
import jwt from "../helpers/jwt.helper";
import log from "../logger";
import User from "../models/user.model";

const NAMESPACE = "User controller";

// (POST) http://localhost:1500/api/user
export const createUser = (req: Request, res: Response) => {
  //Check if email already exists
  return User.findOne({ email: req.body.email }).exec((error, user) => {
    if (error) {
      log.error(NAMESPACE, error.message, error);
      return res.status(500).json({ error: error.message });
    }

    //Email does not exist
    if (user)
      return res.status(400).json({ error: "The email is already registered" });

    //Creating a user add the admin role, this is temporarily
    const newUser = new User({
      ...req.body,
      roleId: process.env.ADMIN_ROLE_ID,
    });

    return newUser
      .save()
      .then((result) => {
        log.info(NAMESPACE, `New user ${newUser.email} added`);
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
  });
};
