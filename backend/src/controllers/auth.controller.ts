import { Request, Response } from "express";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Load from env
const JWT_SECRET = process.env.JWT_SECRET || "change_this";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const COOKIE_NAME = process.env.COOKIE_NAME || "todo_app_jwt";
const COOKIE_SECURE = process.env.COOKIE_SECURE === "true";

// Helper to sign JWT
const signToken = (payload: object) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

// Register new user
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name: name ?? null, email, password: hashed },
    });

    // sign JWT
    const token = signToken({ userId: user.id });

    // set cookie (httpOnly)
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: COOKIE_SECURE,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days (adjust to JWT_EXPIRES_IN)
      path: "/",
    });

    // do not return password
    const { password: _p, ...safe } = (user as any);
    return res.status(201).json({ user: safe });
  } catch (err) {
    console.error("REGISTER ERROR", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login existing user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({ userId: user.id });

    // Store JWT inside HttpOnly cookie
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: COOKIE_SECURE,
      sameSite: "lax",
      path: "/",
    });

    // remove password from user object
    const { password: _pw, ...safeUser } = user as any;

    return res.json({
      message: "Login successful",
      token,         // sending token also (frontend can store it)
      user: safeUser // safe user info
    });

  } catch (err) {
    console.error("LOGIN ERROR", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


// Logout user
export const logout = async (req: Request, res: Response) => {
  const COOKIE_NAME = process.env.COOKIE_NAME || "todo_app_jwt";
  res.clearCookie(COOKIE_NAME, { path: "/" });
  return res.json({ ok: true });
};

// protected endpoint to show current user
export const me = async (req: Request, res: Response) => {
  // authMiddleware attaches req.user
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  // do not send password
  const { password: _p, ...safe } = user;
  return res.json({ user: safe });
};
