import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";

const DEFAULT_JWT_SECRET = "teamflow-dev-secret";

function getJwtSecret() {
  return process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
}

export function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    getJwtSecret(),
    {
      jwtid: randomUUID(),
      expiresIn: "15m",
    }
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    getJwtSecret(),
    {
      expiresIn: "7d",
    }
  );
}