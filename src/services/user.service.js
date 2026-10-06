import { NotFoundError } from "../errors/service.errors.js";
import { readFile, writeFile } from "node:fs/promises";

const usersFilePath = new URL("../../data/users.json", import.meta.url);

async function readUsers() {
  const usersData = await readFile(usersFilePath, "utf8");

  return JSON.parse(usersData);
}

async function writeUsers(users) {
  await writeFile(
    usersFilePath,
    JSON.stringify(users, null, 2)
  );
}

async function getUser(userId) {
  const users = await readUsers();

  const user = users.find(
    (user) => user.id === Number(userId)
  );

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
}

async function getUsers() {
  return readUsers();
}

async function createUser(userData) {
  const users = await readUsers();

  const newUser = {
    id: users.length
      ? Math.max(...users.map((user) => user.id)) + 1
      : 1,
    ...userData,
  };

  users.push(newUser);

  await writeUsers(users);

  return newUser;
}

async function updateUser(userId, userData) {
  const users = await readUsers();

  const index = users.findIndex(
    (user) => user.id === Number(userId)
  );

  if (index === -1) {
    throw new NotFoundError("User not found");
  }

  users[index] = {
    ...users[index],
    ...userData,
  };

  await writeUsers(users);

  return users[index];
}

async function patchUser(userId, userData) {
  return updateUser(userId, userData);
}

async function deleteUser(userId) {
  const users = await readUsers();

  const index = users.findIndex(
    (user) => user.id === Number(userId)
  );

  if (index === -1) {
    throw new NotFoundError("User not found");
  }

  const deletedUser = users.splice(index, 1)[0];

  await writeUsers(users);

  return deletedUser;
}

export {
  getUser,
  getUsers,
  createUser,
  updateUser,
  patchUser,
  deleteUser,
};