import express from "express";

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import projectRoutes from "./routes/project.routes.js";
import prisma from "./config/prisma.js";
const app = express();

async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    const [result] = await prisma.$queryRaw`SELECT NOW() AS now`;
    console.log("Connection successful! Current time from DB:", result.now);
  } catch (error) {
    console.error("Error connecting to the database:", error.stack);
  }
}

testDatabaseConnection();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "teamflow-api",
  });
});

app.get("/health/details", (req, res) => {
  res.json({
    nodeVersion: process.version,
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
  });
});

app.use("/api/users", userRoutes);

export default app;