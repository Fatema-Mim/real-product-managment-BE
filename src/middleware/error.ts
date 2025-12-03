import { Request, Response, NextFunction } from "express";

export const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
  console.error("Error:", error.message);
  console.error("Stack:", error.stack);

  response.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};

export const notFound = (request: Request, response: Response, next: NextFunction) => {
  response.status(404).json({
    message: "Route not found",
  });
};
