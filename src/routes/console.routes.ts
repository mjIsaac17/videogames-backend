import express from "express";

import { validateJWT } from "../middlewares/validateJWT";
import validate from "../middlewares/validateRequests";
import { isAdmin } from "../middlewares/validateRole";
import { isMongoId } from "../middlewares/validateMongoId";
import {
  createConsoleSchema,
  updateConsoleSchema,
} from "../schemas/console.schema";
import {
  createConsole,
  getAllConsoles,
  getConsole,
  logicalDeleteConsole,
  updateConsole,
} from "../controllers/console.controller";

const router = express.Router();

router.get("/ping", (req, res) => res.status(200).send("OK"));
router.get("/", validateJWT, getAllConsoles);
router.get("/:id", [validateJWT, isMongoId], getConsole);
router.post(
  "/",
  [validateJWT, isAdmin, validate(createConsoleSchema)],
  createConsole
);
router.put("/:id", [isMongoId, validate(updateConsoleSchema)], updateConsole);
router.delete("/:id", isMongoId, logicalDeleteConsole);

export default router;