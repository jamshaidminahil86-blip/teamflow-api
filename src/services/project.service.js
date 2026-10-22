
import prisma from "../config/prisma.js";
import redis from "../config/redis.js";

const PROJECT_CACHE_TTL = 60;

export async function getProjects() {
  return prisma.project.findMany({
    orderBy: {
      id: "asc",
    },
  });
}

export async function getProjectById(id) {
  const projectId = Number(id);
  const cacheKey = `project:${projectId}`;

  try {
    const cachedProject = await redis.get(cacheKey);

    if (cachedProject !== null) {
      console.log("Project cache HIT:", projectId);
      return JSON.parse(cachedProject);
    }
  } catch (error) {
    console.error("Project cache read error:", error.message);
  }

  console.log("Project cache MISS:", projectId);

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (project !== null) {
    try {
      await redis.set(
        cacheKey,
        JSON.stringify(project),
        "EX",
        PROJECT_CACHE_TTL
      );
    } catch (error) {
      console.error("Project cache write error:", error.message);
    }
  }

  return project;
}
export async function createProjectWithInitialTask({
  name,
  description,
  ownerId,
  initialTaskTitle,
}) {
}
export async function updateProject(id, data) {
  const projectId = Number(id);

  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
    },
  });

  await redis.del(`project:${projectId}`);

  return project;
}


export async function deleteProject(id) {
  const projectId = Number(id);

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });

  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  if (project._count.tasks > 0) {
    const error = new Error(
      "Cannot delete project because it has linked tasks"
    );
    error.status = 409;
    throw error;
  }

  const deletedProject = await prisma.project.delete({
    where: { id: projectId },
  });

  await redis.del(`project:${projectId}`);

  return deletedProject;
}
