import express from "express";
import log from "./logger";
import connectToMongo from "./db/connect";
import config from "./config/config";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";

const NAMESPACE = "Server";
const router = express();

/** Log the requests */
router.use((req, res, next) => {
  log.info(
    NAMESPACE,
    `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`
  );

  res.on("finish", () => {
    log.info(
      NAMESPACE,
      `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`
    );
  });

  next();
});

router.use(express.json());

/** Routes */
router.use("/api/user", userRoutes);
router.use("/api/auth", authRoutes);

/** Error handling */
router.use((req, res, next) => {
  const error = new Error("Not found");
  return res.status(505).json({
    message: error.message,
  });
});

router.listen(config.server.port, () => {
  log.info(
    NAMESPACE,
    `Server running at http://${config.server.hostname}:${config.server.port}`
  );
  connectToMongo();
});
