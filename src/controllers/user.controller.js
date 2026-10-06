
import {getUser,getUsers,createUser as createUserService,updateUser as updateUserService,   deleteUser as deleteUserService,patchUser as patchUserService,} from "../services/user.service.js";

async function getAllUsers(req, res) {
  const users = await getUsers();

  res.status(200).json(users);
}

async function getUserById(req, res) {
  const userId = Number(req.params.id);

  const user = await getUser(userId);

  res.status(200).json(user);
}

async function createUser(req, res) {
  const user = await createUserService(req.body);

  res.status(201).json(user);
}

async function updateUser(req, res) {
  const userId = Number(req.params.id);

  const user = await updateUserService(userId, req.body);

  res.status(200).json(user);
}

async function patchUser(req, res) {
  const userId = Number(req.params.id);

  const user = await patchUserService(userId, req.body);

  res.status(200).json(user);
}

async function deleteUser(req, res) {
  const userId = Number(req.params.id);

  const user = await deleteUserService(userId);

  res.status(200).json(user);
}
export {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  patchUser,
};