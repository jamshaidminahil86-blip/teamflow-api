import bcrypt from "bcryptjs";

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password, hashedPassword) {
  if (!password || !hashedPassword) {
    return false;
  }

  return await bcrypt.compare(password, hashedPassword);
}