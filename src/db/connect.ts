import mongoose from "mongoose";
import config from "../config/config";
import log from "../logger";

const NAMESPACE = "Connect";

const connect = () => {
  return mongoose
    .connect(config.mongo.url)
    .then(() => log.info(NAMESPACE, "Connected to Mongo"))
    .catch((error) => {
      log.error(NAMESPACE, "Error connecting to Mongo", error);
      process.exit(1); //1 = failure
    });
};

export default connect;
