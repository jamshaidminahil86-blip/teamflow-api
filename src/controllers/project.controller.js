
import {
  createProjectWithInitialTask,
  getProjects,
  getProjectById as findProjectById,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService,
} from "../services/project.service.js";

// GET /api/projects
export async function getAllProjects(req, res, next) {
  try {
    const projects = await getProjects();
    return res.json(projects);
  } catch (error) {
    next(error);
  }
}

// GET /api/projects/:id
export async function getProjectById(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Valid project ID is required",
      });
    }

    const project = await findProjectById(id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    return res.json(project);
  } catch (error) {
    next(error);
  }
}

// POST /api/projects/with-initial-task
export async function createProject(req, res, next) {
  try {
    const result = await createProjectWithInitialTask(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

// PUT /api/projects/:id
export async function updateProject(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Valid project ID is required",
      });
    }

    const project = await updateProjectService(id, req.body);
    return res.json(project);
  } catch (error) {
    next(error);
  }
}

// DELETE /api/projects/:id
export async function deleteProject(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Valid project ID is required",
      });
    }

    const project = await deleteProjectService(id);
    return res.json({
      message: "Project deleted successfully",
      project,
    });
    } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        message: error.message,
      });
    }

    next(error);
  }
}
