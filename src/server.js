
import fs from "fs/promises";
import "dotenv/config";
import app from "./app.js";
import logger from "./utils/logger.js";
logger.info("Server started");
logger.error("Test error");
import { auditEmitter, log } from "./utils/audit.js";
import os from "os";
import crypto from "crypto";

const token = crypto.randomBytes(16).toString("hex");
console.log("Token:", token);

await fs.writeFile("test.txt", "Hello TeamFlow");
console.log("File created!");


const hash = crypto
  .createHash("sha256")
  .update("hello123")
  .digest("hex");

console.log("Hash:", hash);

console.log("Platform:", os.platform());
console.log("CPU:", os.cpus().length);
console.log("Free Memory:", os.freemem());

auditEmitter.emit("user.created", {
  actorId: "user123",
  entityId: "456",
});

auditEmitter.emit("user.updated", {
  actorId: "user123",
  entityId: "456",
});

auditEmitter.emit("user.deleted", {
  actorId: "user123",
  entityId: "456",
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});