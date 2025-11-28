import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "change_this";
const COOKIE_NAME = process.env.COOKIE_NAME || "todo_app_jwt";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // token can come from cookie or Authorization header (Bearer)
    let token: string | undefined;

    if (req.cookies && req.cookies[COOKIE_NAME]) token = req.cookies[COOKIE_NAME];
    else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    console.log(token)

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (!payload?.userId) return res.status(401).json({ error: "Invalid token" });

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return res.status(401).json({ error: "User not found" });

    // attach to req
    (req as any).user = user;
    next();
  } catch (err) {
    console.error("AUTH MIDDLEWARE ERROR", err);
    return res.status(401).json({ error: "Not authenticated" });
  }
};
