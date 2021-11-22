import { Request, Response } from "express";
import jwtHelper from "../helpers/jwt.helper";
import log from "../logger";
import User from "../models/user.model";
import Role from "../models/role.model";

const NAMESPACE = "Auth controller";

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  //Check if email exists
  return User.findOne({ email })
    .populate("roleId", "name", Role)
    .exec((error, user) => {
      if (error) {
        log.error(NAMESPACE, error.message, error);
        return res.status(404).json({ error: error.message });
      }

      //Email does not exist
      if (!user)
        return res.status(400).json({ error: "Invalid email or password" });

      const validPassword = user.comparePassword(password);
      if (!validPassword)
        return res.status(400).json({ error: "Invalid email or password" });

      //Generate auth and refresh token
      const { authToken, refreshToken } = jwtHelper.generateTokens(
        user.id,
        user.name
      );
      return res.json({ user, authToken, refreshToken });
    });
};

export const renewToken = (req: Request, res: Response) => {
  const refreshToken = req.header(process.env.HEADER_REFRESH_TOKEN as string);

  // Verify is token is valid
  const { validToken, tokenData } = jwtHelper.validateToken(
    refreshToken as string
  );
  if (validToken) {
    //Generate new auth and refresh token
    const { authToken, refreshToken } = jwtHelper.generateTokens(
      //@ts-ignore
      (req.userId = tokenData.userId),
      //@ts-ignore
      (req.userName = tokenData.userName)
    );
    return res.json({ authToken, refreshToken });
  } else {
    return res
      .status(401)
      .json({ error: "Invalid refresh token. Sign in required" });
  }
};
