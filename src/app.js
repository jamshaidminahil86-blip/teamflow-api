
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import projectRoutes from "./routes/project.routes.js";

import prisma from "./config/prisma.js";

const app = express();

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

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "teamflow-api",
  });
});

export default app;
