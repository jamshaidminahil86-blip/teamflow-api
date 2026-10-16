
import prisma from "../config/prisma.js";

export async function getProjects() {
  return prisma.project.findMany({
    orderBy: {
      id: "asc",
    },
  });
}

export async function getProjectById(id) {
  return prisma.project.findUnique({
    where: {
      id: Number(id),
    },
  });
}

export async function createProjectWithInitialTask({
  name,
  description,
  ownerId,
  initialTaskTitle,
}) {
  return prisma.$transaction(async (tx) => {
    const numericOwnerId = Number(ownerId);

    const owner = await tx.user.findUnique({
      where: { id: numericOwnerId },
      select: { id: true },
    });

    if (!owner) {
      throw new Error("Valid project owner not found");
    }

    const project = await tx.project.create({
      data: {
        name,
        description: description || null,
        ownerId: numericOwnerId,
      },
    });

    let task = null;

    if (initialTaskTitle?.trim()) {
      task = await tx.task.create({
        data: {
          title: initialTaskTitle.trim(),
          projectId: project.id,
          createdById: owner.id,
        },
      });
    }

    const auditLog = await tx.auditLog.create({
      data: {
        action: "PROJECT_CREATED",
        entityType: "Project",
        entityId: project.id,
        userId: owner.id,
        projectId: project.id,
        details: {
          message: "Project created successfully",
        },
      },
    });

    return { project, task, auditLog };
  });
}
