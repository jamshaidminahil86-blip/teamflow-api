import prisma from "../config/prisma.js";

export async function createProjectWithInitialTask({
  name,
  description,
  ownerId,
  initialTaskTitle,
}) {
  return prisma.$transaction(async (tx) => {
    const owner = await tx.user.findUnique({
      where: { id: Number(ownerId) },
      select: { id: true },
    });

    // 1. Create Project
    const project = await tx.project.create({
      data: {
        name,
        description,
        ownerId: Number(ownerId),
      },
    });

    // 2. Create initial Task
    const task = await tx.task.create({
      data: {
        title: initialTaskTitle,
        projectId: project.id,
        createdById: owner?.id ?? null,
      },
    });

    // 3. Create Audit Log
    const auditLog = await tx.auditLog.create({
      data: {
        action: "PROJECT_CREATED",
        entityType: "Project",
        entityId: project.id,
        userId: owner?.id ?? null,
        projectId: project.id,
        details: {
          message: "Project and initial task created together",
        },
      },
    });

    return { project, task, auditLog };
  });
}
