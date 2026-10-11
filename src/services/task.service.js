
import prisma from "../config/prisma.js";
import { NotFoundError } from "../errors/service.errors.js";

async function getTasks(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  const where = userId
  ? { assigneeId: Number(userId) }
  : {};

  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: "asc" },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    data: tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getTask(taskId) {
  const task = await prisma.task.findUnique({
    where: { id: Number(taskId) },
  });

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  return task;
}

async function createTask(taskData) {
  return prisma.task.create({
    data: taskData,
  });
}

async function updateTask(taskId, taskData) {
  await getTask(taskId);

  return prisma.task.update({
    where: { id: Number(taskId) },
    data: taskData,
  });
}

async function deleteTask(taskId) {
  await getTask(taskId);

  return prisma.task.delete({
    where: { id: Number(taskId) },
  });
}

export {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};