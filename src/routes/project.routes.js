import express from "express";
import {
  createProject,
  getAllProjects,
} from "../controllers/project.controller.js";

const router = express.Router();

router.get("/", getAllProjects);
router.post("/with-initial-task", createProject);

export default router;
