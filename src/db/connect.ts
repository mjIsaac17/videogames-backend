import mongoose from "mongoose";
import config from "config";
import log from "../logger";

const connect = () => {
    const dbUri = config.get("dbUri") as string;
    return mongoose
        .connect(dbUri)
        .then(() => log.info("Database connected"))
        .catch((error) => {
            log.error(`DB error: ${error}`);
            process.exit(1); //1 = failure
        });
};

export default connect;
