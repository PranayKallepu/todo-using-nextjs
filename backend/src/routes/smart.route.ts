import { Router } from "express";
import { smartTodoCreate } from "../controllers/smart.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, smartTodoCreate);

export default router;
