import jwt from "jsonwebtoken";
import {
  validateRegister,
  validateLogin,
} from "../validators/auth.validator.js";

import {
  hashPassword,
  comparePassword,
} from "../utils/password.js";

import {
  createUser,
  getUserByEmail,
  getUser,
} from "../services/user.service.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.js";

export async function register(req, res) {
  const errors = validateRegister(req.body);

  if (errors) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  const hashedPassword = await hashPassword(req.body.password);

  const user = await createUser({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  const { password, ...safeUser } = user;

  return res.status(201).json({
    message: "User registered successfully",
    user: safeUser,
  });
}

export async function login(req, res) {
  const errors = validateLogin(req.body);

  if (errors) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  const user = await getUserByEmail(req.body.email);

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordCorrect = await comparePassword(
    req.body.password,
    user.password
  );

  if (!isPasswordCorrect) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return res.status(200).json({
    message: "Login successful",
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
}

export async function getMe(req, res) {
  const user = await getUser(req.user.id);

  return res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
}