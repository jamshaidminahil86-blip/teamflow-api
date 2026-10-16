import {
  createProjectWithInitialTask,
  getProjects,
} from "../services/project.service.js";

export async function getAllProjects(req, res) {
  const projects = await getProjects();
  res.status(200).json({ data: projects });
}

export async function createProject(req, res) {
const result = await createProjectWithInitialTask({
name: req.body.name,
description: req.body.description,
ownerId: req.body.ownerId,
initialTaskTitle: req.body.initialTaskTitle,
});

res.status(201).json({
message: "Project, initial task, and audit log created successfully",
data: result,
});
}
