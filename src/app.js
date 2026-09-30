import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "teamflow-api"
  });
});

export default app;
app.get("/health/details", (req, res) => {
  res.json({
    nodeVersion: process.version,
    environment: process.env.NODE_ENV,
    uptime: process.uptime()
  });
});