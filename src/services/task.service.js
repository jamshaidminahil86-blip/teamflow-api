
import prisma from "../config/prisma.js";
import redis from "../config/redis.js";
import { NotFoundError } from "../errors/service.errors.js";

const TASK_CACHE_TTL = 60;

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
  const id = Number(taskId);
  const cacheKey = `task:${id}`;

  try {
    const cachedTask = await redis.get(cacheKey);

    if (cachedTask !== null) {
      console.log("Task cache HIT:", id);
      return JSON.parse(cachedTask);
    }
  } catch (error) {
    console.error("Task cache read error:", error.message);
  }

  // 2. Cache mein na mile to database se lo
  console.log("Task cache MISS:", id);

  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  try {
    await redis.set(
      cacheKey,
      JSON.stringify(task),
      "EX",
      TASK_CACHE_TTL
    );
  } catch (error) {
    console.error("Task cache write error:", error.message);
  }

  return task;
}

async function createTask(taskData) {
  const task = await prisma.task.create({
    data: taskData,
  });

  return task;
}

async function updateTask(taskId, taskData) {
  await getTask(taskId);

  const task = await prisma.task.update({
    where: { id: Number(taskId) },
    data: taskData,
  });

  try {
    await redis.del(`task:${Number(taskId)}`);
  } catch (error) {
    console.error("Task cache invalidation error:", error.message);
  }

  return task;
}

async function deleteTask(taskId) {
  await getTask(taskId);

  const task = await prisma.task.delete({
    where: { id: Number(taskId) },
  });

  try {
    await redis.del(`task:${Number(taskId)}`);
  } catch (error) {
    console.error("Task cache invalidation error:", error.message);
  }

  return task;
}

export {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
