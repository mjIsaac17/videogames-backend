import { NextFunction, Request, Response } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  //@ts-ignore
  const { userRoleId } = req;
  if (userRoleId === (process.env.ADMIN_ROLE_ID as string)) next();
  else
    return res
      .status(401)
      .json({ error: "You are not allowed to perform this action" });
};
