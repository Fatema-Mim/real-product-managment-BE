import { Request } from "express";

export interface AuthUser {
  userId: string;
  username: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
