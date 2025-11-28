import { Router } from "express";
import { handleChatMessage } from "../controllers/chat.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, handleChatMessage);

export default router;
