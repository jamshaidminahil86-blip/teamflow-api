import { createProjectWithInitialTask } from "../services/project.service.js";

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
