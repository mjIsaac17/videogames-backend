import { Request, Response } from "express";
import Company from "../models/company.model";
import log from "../logger";

const NAMESPACE = "Company controller";

export const createCompany = (req: Request, res: Response) => {
  const company = new Company(req.body);

  try {
    company
      .save()
      .then((result) => {
        log.info(NAMESPACE, `New company added: ${result.name}`);
        return res.status(201).json({ company: result });
      })
      .catch((error) => {
        log.error(NAMESPACE, "Error when adding a new company", error);
        return res.status(500).json(error);
      });
  } catch (error) {
    log.error(NAMESPACE, "Error when adding a new company", error);
    return res.status(500).json(error);
  }
};
