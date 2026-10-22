
import redis from "./config/redis.js";

try {
  const result = await redis.ping();
  console.log("Redis ping:", result);

  await redis.set("test:key", "Hello Redis");
  const value = await redis.get("test:key");

  console.log("Redis value:", value);
} catch (error) {
  console.error("Redis test failed:", error.message);
} finally {
  redis.disconnect();
}
