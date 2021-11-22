import dotenv from "dotenv";
import { toInteger } from "lodash";

dotenv.config();

const port = toInteger(process.env.SERVER_PORT || 8080);

const SERVER = {
  hostname: process.env.SERVER_HOSTNAME || "localhost",
  port,
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || "admin";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "admin-password";
const MONGO_HOST = process.env.MONGO_URL;

const MONGO = {
  host: MONGO_HOST,
  username: MONGO_USERNAME,
  password: MONGO_PASSWORD,
  url: `mongodb+srv://${MONGO_PASSWORD}:${MONGO_PASSWORD}@${MONGO_HOST}`,
};

const config = {
  mongo: MONGO,
  server: SERVER,
};

export default config;
