import { NextFunction, Request, Response } from "express";
import { AnySchema } from "yup";

//Receives an schema and by default the request, response and next function
const validate =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };

export default validate;
