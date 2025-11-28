import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createTodo = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
      tags,
      userId,
    } = req.body;

    if (!title || !userId) {
      return res.status(400).json({ error: "title and userId are required" });
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        tags: Array.isArray(tags) ? tags : [],
        userId,
      },
    });

    return res.json(todo);
  } catch (err) {
    console.error("Error creating todo:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getTodos = async (_: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany({ orderBy: { id: "desc" } });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      completed,
      dueDate,
      priority,
      tags,
      recurrence
    } = req.body;

    const todo = await prisma.todo.update({
      where: { id: Number(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(completed !== undefined && { completed }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(priority !== undefined && { priority }),
        ...(tags !== undefined && { tags }),
        ...(recurrence !== undefined && { recurrence }),
      },
    });

    return res.json(todo);

  } catch (error) {
    console.error("Update error:", error);
    return res.status(404).json({ error: "Todo not found or update failed" });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.todo.delete({ where: { id: Number(id) } });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(404).json({ error: "Todo not found" });
  }
};

export const filterTodos = async (req: Request, res: Response) => {
  try {
    const { userId, from, to, priority, completed, search } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const todos = await prisma.todo.findMany({
      where: {
        userId: Number(userId),

        // Optional priority filter
        priority: priority ? priority.toString().toUpperCase() as any : undefined,

        // Optional completed filter
        completed:
          completed === "true"
            ? true
            : completed === "false"
            ? false
            : undefined,

        // Optional date range filter
        dueDate: {
          gte: from ? new Date(from.toString()) : undefined,
          lte: to ? new Date(to.toString()) : undefined,
        },
        // Optional search filter
        title: search ? { contains: search.toString(), mode: "insensitive" } : undefined,
        
      },
      orderBy: { dueDate: "asc" },
    });

    return res.json(todos);
  } catch (error) {
    console.error("FILTER API ERROR:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
