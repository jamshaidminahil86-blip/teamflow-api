
import "dotenv/config";
import app, { redisHealthClient } from "./app.js";
import fs from "fs/promises";
import logger from "./utils/logger.js";
import { auditEmitter } from "./utils/audit.js";
import os from "os";
import crypto from "crypto";
import prisma from "./config/prisma.js";
import reportQueue from "./queues/report.queue.js";
import reportWorker from "./workers/report.worker.js";

console.log("JWT_SECRET loaded:", Boolean(process.env.JWT_SECRET));

logger.info("Server started");
logger.error("Test error");
await logger.warn("This is a warning");

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
  actorId: "user 123",
  entityId: "456",
});

auditEmitter.emit("user.updated", {
  actorId: "user 123",
  entityId: "456",
});

auditEmitter.emit("user.deleted", {
  actorId: "user 123",
  entityId: "456",
});

const PORT = Number(process.env.PORT || 5000);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

const sockets = new Set();
server.on("connection", (socket) => {
  sockets.add(socket);
  socket.once("close", () => sockets.delete(socket));
});

const SHUTDOWN_TIMEOUT_MS = 10000;
const HTTP_DRAIN_TIMEOUT_MS = 5000;
let shutdownPromise;

function closeHttpServer() {
  return new Promise((resolve, reject) => {
    const drainTimer = setTimeout(() => {
      console.warn("HTTP drain timed out. Closing remaining connections.");
      console.log(
        "Open HTTP socket count before closeAllConnections():",
        sockets.size,
        [...sockets].map(({ remoteAddress, remotePort, destroyed }) => ({
          remoteAddress,
          remotePort,
          destroyed,
        }))
      );
      server.closeAllConnections();
      console.log(
        "Open HTTP socket count immediately after closeAllConnections():",
        sockets.size
      );
      for (const socket of sockets) {
        socket.destroy();
      }
    }, HTTP_DRAIN_TIMEOUT_MS);

    server.close((error) => {
      console.log("server.close() callback invoked.", {
        error: error?.message,
        openHttpSockets: sockets.size,
      });
      clearTimeout(drainTimer);
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });

    server.closeIdleConnections();
  });
}

async function gracefulShutdown(signal) {
  if (shutdownPromise) {
    console.log(`${signal} received while shutdown is already in progress.`);
    return shutdownPromise;
  }

  shutdownPromise = (async () => {
    const errors = [];
    const forceExitTimer = setTimeout(() => {
      console.error("Shutdown timed out. Forcing exit.");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);

    console.log(`${signal} received. Starting graceful shutdown...`);

    const runStep = async (name, operation) => {
      console.log(`${name}...`);
      try {
        await operation();
        console.log(`${name} completed.`);
      } catch (error) {
        errors.push(error);
        console.error(`${name} failed:`, error);
      }
    };

    try {
      await runStep("Closing HTTP server", closeHttpServer);

      await Promise.all([
        runStep("Closing report worker", () => reportWorker.close()),
        runStep("Closing report queue", () => reportQueue.close()),
      ]);

      await runStep("Disconnecting Prisma", () => prisma.$disconnect());
      await runStep("Closing Redis health-check client", () =>
        redisHealthClient.disconnect()
      );

      if (errors.length > 0) {
        console.error("Graceful shutdown completed with errors.");
        process.exitCode = 1;
      } else {
        console.log("Graceful shutdown completed.");
        process.exitCode = 0;
      }
    } finally {
      clearTimeout(forceExitTimer);
    }
  })();

  return shutdownPromise;
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
