import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";

import log from "./logger";
import connectToMongo from "./db/connect";
import config from "./config/config";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import companyRoutes from "./routes/company.routes";
import consoleRoutes from "./routes/console.routes";
import videogameRoutes from "./routes/videogame.routes";

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
router.use(fileUpload());
router.use(cors());

/** Routes */
router.use("/api/user", userRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/company", companyRoutes);
router.use("/api/console", consoleRoutes);
router.use("/api/videogame", videogameRoutes);

/** Error handling */
router.use((req, res, next) => {
  const error = new Error("Route not found");
  return res.status(505).json({
    error: error.message,
  });
});

router.listen(config.server.port, () => {
  log.info(
    NAMESPACE,
    `Server running at http://${config.server.hostname}:${config.server.port}`
  );
  connectToMongo();
});
