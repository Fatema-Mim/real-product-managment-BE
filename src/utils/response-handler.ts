import { Response } from "express";
import { ValidationError, AuthenticationError, NotFoundError, DatabaseError } from "./custom-errors";

export const handleError = (response: Response, error: unknown, context: string) => {
  console.error(`${context}:`, error);

  if (error instanceof ValidationError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof AuthenticationError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof NotFoundError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof DatabaseError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  return response.status(500).json({ message: "Internal server error" });
};

export const sendSuccess = (response: Response, data: any, statusCode: number = 200) => {
  return response.status(statusCode).json(data);
};

export const sendNotFound = (response: Response, message: string = "Resource not found") => {
  return response.status(404).json({ message });
};

export const sendBadRequest = (response: Response, message: string) => {
  return response.status(400).json({ message });
};
