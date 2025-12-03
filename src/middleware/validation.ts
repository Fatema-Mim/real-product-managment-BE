import { Request, Response, NextFunction } from "express";

export const validateLoginInput = (request: Request, response: Response, next: NextFunction) => {
  const { username, password } = request.body;

  if (!username || typeof username !== "string") {
    return response.status(400).json({
      message: "Username is required and must be a string",
    });
  }

  if (!password || typeof password !== "string") {
    return response.status(400).json({
      message: "Password is required and must be a string",
    });
  }

  next();
};

export const validateProductInput = (request: Request, response: Response, next: NextFunction) => {
  const { name, price, status } = request.body;

  if (!name || typeof name !== "string") {
    return response.status(400).json({
      message: "Product name is required and must be a string",
    });
  }

  if (typeof price !== "number" || price < 0) {
    return response.status(400).json({
      message: "Price must be a valid positive number",
    });
  }

  if (!status || !["active", "inactive"].includes(status)) {
    return response.status(400).json({
      message: "Status must be either 'active' or 'inactive'",
    });
  }

  next();
};
