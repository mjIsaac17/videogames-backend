import { Request, Response, NextFunction } from "express";
import jwtHelper from "../helpers/jwt.helper";

export const validateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // x-token headers
  const token = req.header(process.env.HEADER_AUTH_TOKEN as string);
  if (!token) {
    return res.status(401).json({
      msg: "There is no token in the request",
    });
  }

  const { validToken } = jwtHelper.validateToken(token);
  if (validToken) next();
  else
    return res.status(401).json({
      msg: "Invalid token",
    });
};
