import { Router } from "express";
import { smartTodoCreate } from "../controllers/smart.controller";

const router = Router();

router.post("/", smartTodoCreate);

export default router;
