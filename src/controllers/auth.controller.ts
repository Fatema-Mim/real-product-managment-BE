import { Request, Response } from "express";
import { login as loginService } from "../services/auth.service";
import { handleError, sendSuccess } from "../utils/response-handler";
import { ValidationError, AuthenticationError } from "../utils/custom-errors";

export const login = async (request: Request, response: Response) => {
  try {
    const { username, password } = request.body;

    if (!username || !password) {
      throw new ValidationError("Username and password are required");
    }

    const result = await loginService(username, password);

    if (!result.success) {
      throw new AuthenticationError(result.message || "Invalid credentials");
    }

    return sendSuccess(response, {
      message: "Login successful",
      token: result.token,
    });
  } catch (error) {
    return handleError(response, error, "Login error");
  }
};

export const logout = async (request: Request, response: Response) => {
  try {
    return sendSuccess(response, {
      message: "Logout successful",
    });
  } catch (error) {
    return handleError(response, error, "Logout error");
  }
};
