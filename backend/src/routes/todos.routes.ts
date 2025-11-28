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
router.get("/", getTodos);
router.patch("/:id", updateTodo);
router.delete("/:id", deleteTodo);
router.get("/filter", filterTodos);

export default router;
