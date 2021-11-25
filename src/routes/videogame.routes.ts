import express from "express";

import { validateJWT } from "../middlewares/validateJWT";
import validate from "../middlewares/validateRequests";
import { isAdmin } from "../middlewares/validateRole";
import { isMongoId } from "../middlewares/validateMongoId";

import {
  createVideogame,
  getAllVideogames,
  getVideogame,
  logicalDeleteVideogame,
  updateVideogame,
} from "../controllers/videogame.controller";
import {
  createVideogameSchema,
  updateVideogameSchema,
} from "../schemas/videogame.schema";

const router = express.Router();

router.get("/ping", (req, res) => res.status(200).send("OK"));
router.get("/", validateJWT, getAllVideogames);
router.get("/:id", [validateJWT, isMongoId], getVideogame);
router.post(
  "/",
  [validateJWT, isAdmin, validate(createVideogameSchema)],
  createVideogame
);
router.put(
  "/:id",
  [validateJWT, isMongoId, validate(updateVideogameSchema)],
  updateVideogame
);
router.delete("/:id", [validateJWT, isMongoId], logicalDeleteVideogame);

export default router;
