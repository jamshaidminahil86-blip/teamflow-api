import jwt from "jsonwebtoken";

export function generateAccessToken(user) {
  console.log(
    "Secret while creating:",
    Boolean(process.env.JWT_SECRET)
  );

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
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
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}