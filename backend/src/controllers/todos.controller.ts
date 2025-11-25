import { Request, Response } from "express";
import prisma from "../config/prisma";

export const filterTodos = async (req: Request, res: Response) => {
  try {
    const { userId, from, to, priority, completed } = req.query;

    const todos = await prisma.todo.findMany({
      where: {
        userId: Number(userId),
        priority: priority as any,
        completed: completed === "true" ? true : completed === "false" ? false : undefined,
        dueDate: {
          gte: from ? new Date(from as string) : undefined,
          lte: to ? new Date(to as string) : undefined,
        },
      },
    });

    res.json(todos);
  } catch (error) {
    console.log("Filter error:", error);
    res.status(500).json({ error: "Failed to filter todos" });
  }
};
