import { Router } from "express";
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  filterTodos
} from "../controllers/todos.controller";

const router = Router();

router.post("/", createTodo);
router.get("/filter", filterTodos);
router.get("/", getTodos);
router.patch("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
