import { createClient } from "redis";
import logger from "../logger";

const REDIS_URL =
    process.env.NODE_ENV === "production"
        ? process.env.REDIS_URL
        : "redis://localhost:6379";

const redisClient = createClient({ url: REDIS_URL });
redisClient.on("error", (err) => {
    logger.error("Redis Error: ", err);
    process.exit(1);
});
export default redisClient;
