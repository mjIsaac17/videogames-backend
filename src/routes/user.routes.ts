import express from "express";
import { createUser } from "../controllers/user.controller";
import { validateJWT } from "../middlewares/validateJWT";
import validate from "../middlewares/validateRequests";
import { createUserSchema } from "../schemas/user.schema";

const router = express.Router();

router.get("/ping", (req, res) => res.status(200).send("OK"));
router.post("/", validateJWT, validate(createUserSchema), createUser);

export default router;
