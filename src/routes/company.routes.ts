import express from "express";
import {
  createCompanySchema,
  updateCompanySchema,
} from "../schemas/company.schema";
import {
  createCompany,
  logicalDeleteCompany,
  getAllCompanies,
  // getCompany,
  updateCompany,
  getCompanyByName,
} from "../controllers/company.controller";
import { validateJWT } from "../middlewares/validateJWT";
import validate from "../middlewares/validateRequests";
// import { isAdmin } from "../middlewares/validateRole";
import { isMongoId } from "../middlewares/validateMongoId";

const router = express.Router();

router.get("/ping", (req, res) => res.status(200).send("OK"));
router.get("/", validateJWT, getAllCompanies);
// router.get("/:id", [isMongoId], getCompany);
router.get("/:name", validateJWT, getCompanyByName);
router.post("/", [validate(createCompanySchema)], createCompany);
router.put(
  "/:id",
  [validateJWT, isMongoId, validate(updateCompanySchema)],
  updateCompany
);
// router.delete("/:id", isMongoId, physicalDeleteCompany);
router.delete("/:id", [validateJWT, isMongoId], logicalDeleteCompany);

export default router;
