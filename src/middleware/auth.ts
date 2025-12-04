import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";

export const authenticate = (request: AuthRequest, response: Response, next: NextFunction) => {
  const authHeader = request.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

  if (!token) {
    return response.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; username: string };
    request.user = {
      userId: decoded.userId,
      username: decoded.username,
    };
    next();
  } catch (error) {
    return response.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
