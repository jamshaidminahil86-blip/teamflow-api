import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log("Authorization header exists:", Boolean(authHeader));

  if (!authHeader) {
    return res.status(401).json({
      message: "Access token required",
    });
  }

  const token = authHeader.split(" ")[1];

  console.log("Token received:", Boolean(token));

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Token verified successfully");

    req.user = decoded;

    next();
  } catch (error) {
    console.log("JWT error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}