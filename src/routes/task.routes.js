
import express from "express";

import {
  getAllTasks,
  getTaskById,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
} from "../controllers/task.controller.js";

const router = express.Router();
console.log("********************",router);


router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", createNewTask);
router.patch("/:id", updateExistingTask);
router.delete("/:id", deleteExistingTask);

export default router;