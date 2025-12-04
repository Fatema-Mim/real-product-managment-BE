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

    response.cookie("token", result.token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      path: "/",
    });

    return sendSuccess(response, {
      message: "Login successful",
    });
  } catch (error) {
    return handleError(response, error, "Login error");
  }
};

export const logout = async (request: Request, response: Response) => {
  try {
    response.clearCookie("token");
    return sendSuccess(response, {
      message: "Logout successful",
    });
  } catch (error) {
    return handleError(response, error, "Logout error");
  }
};
