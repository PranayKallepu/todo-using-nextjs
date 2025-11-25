import { Request, Response } from "express";
import { parseSmartTodo } from "../services/nlp.service";
import prisma from "../config/prisma";

export const smartTodoCreate = async (req: Request, res: Response) => {
  try {
    const { text, userId } = req.body;

    if (!text) return res.status(400).json({ error: "Text is required" });
    if (userId === undefined || userId === null) return res.status(400).json({ error: "userId is required" });

    const uid = Number(userId);
    if (Number.isNaN(uid)) return res.status(400).json({ error: "userId must be a number" });

    // Ensure user exists to avoid FK violation
    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) return res.status(400).json({ error: `User with id ${uid} not found` });

    // Get parsed data from NLP service
    const parsed = await parseSmartTodo(text);

    const todo = await prisma.todo.create({
      data: {
        title: parsed.title,
        dueDate: parsed.dueDate,
        priority: parsed.priority,
        recurrence: parsed.recurrence,
        tags: parsed.tags,
        userId: uid,
      },
    });

    return res.json({
      message: "Smart todo created successfully!",
      todo,
    });
  } catch (error) {
    console.error("SMART INPUT ERROR:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};