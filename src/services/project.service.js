import { NotFoundError } from "../errors/service.errors.js";

const projects = [
  {
    id: 1,
    name: "TeamFlow",
    description: "Team management project",
  },
  {
    id: 2,
    name: "E-Commerce",
    description: "Online shopping project",
  },
];

export async function getProjects() {
  return projects;
}

export async function getProjectById(projectId) {
  const project = projects.find((project) => project.id === Number(projectId));

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  return project;
}

export async function createProject(projectData) {
  const newProject = {
    id: projects.length + 1,
    ...projectData,
  };

  projects.push(newProject);

  return newProject;
}

export async function updateProject(projectId, projectData) {
  const project = projects.find((project) => project.id === Number(projectId));

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  Object.assign(project, projectData);

  return project;
}

export async function deleteProject(projectId) {
  const index = projects.findIndex(
    (project) => project.id === Number(projectId)
  );

  if (index === -1) {
    throw new NotFoundError("Project not found");
  }

  const deletedProject = projects.splice(index, 1);

  return deletedProject[0];
}