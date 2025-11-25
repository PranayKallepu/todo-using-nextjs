import { Request, Response } from "express";
import { processChatAI } from "../services/ai.service";

export const handleChatMessage = async (req: Request, res: Response) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const reply = await processChatAI(message, Number(userId));

    return res.json({ reply });
  } catch (error) {
    console.error("CHAT API ERROR:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
