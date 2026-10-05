import { NotFoundError } from "../errors/service.errors.js";

const users = [
  {
    id: 1,
    name: "Bubu",
    email: "Bubu@gmail.com",
  },
  {
    id: 2,
    name: "Suli",
    email: "suli@gmail.com",
  },
];

async function getUser(userId) {
  const user = users.find((user) => user.id === userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
}

async function getUsers() {
  return users;
}

export {
  getUser,
  getUsers,
};