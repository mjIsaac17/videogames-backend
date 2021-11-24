import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";

export const isMongoId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const isValid = isValidObjectId(id);
  if (isValid) return next();

  return res.status(400).json({ error: "Invalid id" });
};
