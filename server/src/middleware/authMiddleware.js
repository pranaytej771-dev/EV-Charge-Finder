import jwt from "jsonwebtoken";

export const verifyToken = (request, response, next) => {
  const authHeader = request.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");
  const secret = process.env.JWT_SECRET;

  if (scheme !== "Bearer" || !token) {
    return response.status(401).json({
      message: "Login required"
    });
  }

  if (!secret) {
    return response.status(500).json({
      message: "JWT_SECRET not defined in environment variables"
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    request.user = decoded;
    next();
  } catch (error) {
    return response.status(401).json({
      message: "Invalid or expired token."
    });
  }
};

export const isAdmin = (request, response, next) => {
  if (request.user?.role !== "admin") {
    return response.status(403).json({
      message: "Access denied"
    });
  }

  next();
};
