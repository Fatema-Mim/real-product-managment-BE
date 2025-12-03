import jwt from "jsonwebtoken";
import { users } from "../data/users";

interface LoginResult {
  success: boolean;
  message: string;
  token?: string;
}

export const login = async (username: string, password: string): Promise<LoginResult> => {
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return {
      success: false,
      message: "Invalid username or password",
    };
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET!,
    { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any }
  );

  return {
    success: true,
    message: "Login successful",
    token,
  };
};
