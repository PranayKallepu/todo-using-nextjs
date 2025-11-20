import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const todo = await prisma.todo.create({ data: { title } });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
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
    const { title, completed } = req.body;

    const todo = await prisma.todo.update({
      where: { id: Number(id) },
      data: { title, completed },
    });

    res.json(todo);
  } catch (error) {
    res.status(404).json({ error: "Todo not found" });
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
