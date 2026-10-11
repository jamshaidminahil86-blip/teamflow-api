import express from "express";
import { createProject } from "../controllers/project.controller.js";

const router = express.Router();

router.post("/with-initial-task", createProject);

export default router;
