
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import projectRoutes from "./routes/project.routes.js";
import reportRoutes from "./routes/report.routes.js";
import prisma from "./config/prisma.js";
import Redis from "ioredis";

const app = express();
const redisHealthClient = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT || 6379),
  maxRetriesPerRequest: 1,
});
export { redisHealthClient };

app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
    ],
  })
);

app.use(express.json());

// Database connection check
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    const [result] = await prisma.$queryRaw`SELECT NOW() AS now`;

    console.log("Database connected:", result.now);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
}

testDatabaseConnection();

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
// Health check

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "teamflow-api",
  });
});

app.get("/health/liveness", (req, res) => {
  res.status(200).json({
    status: "alive",
  });
});

app.get("/health/readiness", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    const redisStatus = await redisHealthClient.ping();

    if (redisStatus !== "PONG") {
      throw new Error("Redis is not ready");
    }

    res.status(200).json({
      status: "ready",
      database: "connected",
      redis: "connected",
    });
  } catch (error) {
    res.status(503).json({
      status: "not ready",
      database: "database or dependency check failed",
    });
  }
});
export default app;