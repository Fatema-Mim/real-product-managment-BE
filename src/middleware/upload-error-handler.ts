import { Request, Response, NextFunction } from "express";
import multer from "multer";

export const handleUploadError = (error: any, request: Request, response: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return response.status(400).json({
        message: "File size is too large. Maximum allowed size is 10MB per file.",
      });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return response.status(400).json({
        message: "Too many files. Maximum 5 images allowed.",
      });
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return response.status(400).json({
        message: "Unexpected field name. Use 'images' field for file uploads.",
      });
    }

    return response.status(400).json({
      message: `Upload error: ${error.message}`,
    });
  }

  if (error.message === "Only JPG and PNG images are allowed") {
    return response.status(400).json({
      message: "Invalid file type. Only JPG and PNG images are allowed.",
    });
  }

  next(error);
};
