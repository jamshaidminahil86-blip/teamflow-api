
import prisma from "../config/prisma.js";
import redis from "../config/redis.js";
import { NotFoundError } from "../errors/service.errors.js";

const USER_CACHE_TTL = 60;

async function getUser(userId) {
  const id = Number(userId);
  const cacheKey = `user:${id}`;

  try {
    const cachedUser = await redis.get(cacheKey);

    if (cachedUser !== null) {
      console.log("User cache HIT:", id);
      return JSON.parse(cachedUser);
    }
  } catch (error) {
    console.error("User cache read error:", error.message);
  }

  console.log("User cache MISS:", id);

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  try {
    await redis.set(
      cacheKey,
      JSON.stringify(user),
      "EX",
      USER_CACHE_TTL
    );
  } catch (error) {
    console.error("User cache write error:", error.message);
  }

  return user;
}

async function getUsers() {
  return prisma.user.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      departmentId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function createUser(userData) {
  return prisma.user.create({
    data: {
      ...userData,
      email: userData.email.toLowerCase(),
    },
  });
}

async function updateUser(userId, userData) {
  await getUser(userId);

  const data = { ...userData };

  if (data.email) {
    data.email = data.email.toLowerCase();
  }

  const user = await prisma.user.update({
    where: { id: Number(userId) },
    data,
  });

  try {
    await redis.del(`user:${Number(userId)}`);
  } catch (error) {
    console.error("User cache invalidation error:", error.message);
  }

  return user;
}

async function patchUser(userId, userData) {
  return updateUser(userId, userData);
}

async function deleteUser(userId) {
  await getUser(userId);

  const user = await prisma.user.delete({
    where: { id: Number(userId) },
  });

  try {
    await redis.del(`user:${Number(userId)}`);
  } catch (error) {
    console.error("User cache invalidation error:", error.message);
  }

  return user;
}

async function getUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

export {
  getUser,
  getUserByEmail,
  getUsers,
  createUser,
  updateUser,
  patchUser,
  deleteUser,
};
