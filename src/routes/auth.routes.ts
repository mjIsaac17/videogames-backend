import express from "express";
import { login, renewToken } from "../controllers/auth.controller";

const router = express.Router();

router.get("/ping", (req, res) => res.status(200).send("OK"));
router.post("/", login);
router.post("/renew", renewToken);

export default router;
