
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "../services/task.service.js";


export async function getAllTasks(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(req.query.limit) || 20)
  );

  const result = await getTasks(null, page, limit);

  res.status(200).json(result);
}

export async function getTaskById(req, res) {
  const task = await getTask(req.params.id);
  res.status(200).json({ data: task });
}


export async function createNewTask(req, res) {
  const task = await createTask({
    title: req.body.title,
    description: req.body.description,
    projectId: Number(req.body.projectId),
    assigneeId: req.body.assigneeId
      ? Number(req.body.assigneeId)
      : null,
    createdById: null,
    status: req.body.status || "TODO",
    priority: req.body.priority || "MEDIUM",
  });

  res.status(201).json({
    message: "Task created successfully",
    data: task,
  });
}

export async function updateExistingTask(req, res) {
  const taskData = {};

  for (const field of [
    "title",
    "description",
    "status",
    "priority",
  ]) {
    if (req.body[field] !== undefined) {
      taskData[field] = req.body[field];
    }
  }

  if (req.body.projectId !== undefined) {
    taskData.projectId = Number(req.body.projectId);
  }

  if (req.body.assigneeId !== undefined) {
    taskData.assigneeId = req.body.assigneeId
      ? Number(req.body.assigneeId)
      : null;
  }

  const task = await updateTask(req.params.id, taskData);

  res.status(200).json({
    message: "Task updated successfully",
    data: task,
  });
}

export async function deleteExistingTask(req, res) {
  await deleteTask(req.params.id);

  res.status(200).json({
    message: "Task deleted successfully",
  });
}
