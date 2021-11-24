import { Request, Response } from "express";
import Company from "../models/company.model";
import log from "../logger";

const NAMESPACE = "Company controller";

export const getAllCompanies = (req: Request, res: Response) => {
  try {
    // get only active companies (not deleted)
    Company.find({ active: true }, (error, companies) => {
      if (error) return res.status(500).json({ error: error.message });

      return res.json({ companies });
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getCompany = (req: Request, res: Response) => {
  try {
    const companyId = req.params.id;
    Company.findById(companyId).exec((error, company) => {
      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json({ company });
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

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

export const updateCompany = (req: Request, res: Response) => {
  const companyId = req.params.id;

  try {
    Company.findByIdAndUpdate(companyId, req.body, {
      returnDocument: "after",
    }).exec((error, company) => {
      if (error) return res.status(500).json({ error: error.message });

      if (!company) return res.status(404).json({ error: "Company not found" });

      return res.json({ company });
    });
  } catch (error) {
    log.error(NAMESPACE, "Error when updating the company", error);
    return res.status(500).json(error);
  }
};

//Physical delete
export const physicalDeleteCompany = (req: Request, res: Response) => {
  const companyId = req.params.id;

  try {
    Company.findByIdAndDelete(companyId).exec((error, company) => {
      if (error) return res.status(500).json({ error: error.message });

      if (!company) return res.status(404).json({ error: "Company not found" });

      return res.sendStatus(200);
    });
  } catch (error) {
    log.error(NAMESPACE, "Error when deleting the company", error);
    return res.status(500).json(error);
  }
};

//Logical delete
export const logicalDeleteCompany = (req: Request, res: Response) => {
  const companyId = req.params.id;

  try {
    Company.findByIdAndUpdate(companyId, { active: false }).exec(
      (error, company) => {
        if (error) return res.status(500).json({ error: error.message });

        if (!company)
          return res.status(404).json({ error: "Company not found" });

        return res.sendStatus(200);
      }
    );
  } catch (error) {
    log.error(NAMESPACE, "Error when deleting the company", error);
    return res.status(500).json(error);
  }
};
