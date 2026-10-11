
import prisma from "../config/prisma.js";
import { NotFoundError } from "../errors/service.errors.js";

async function getUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });

  if (!user) {
    throw new NotFoundError("User not found");
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

  return prisma.user.update({
    where: { id: Number(userId) },
    data,
  });
}

async function patchUser(userId, userData) {
  return updateUser(userId, userData);
}

async function deleteUser(userId) {
  await getUser(userId);

  return prisma.user.delete({
    where: { id: Number(userId) },
  });
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