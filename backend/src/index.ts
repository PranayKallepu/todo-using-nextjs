import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import todoRoutes from "./routes/todos.routes";
import chatRoutes from "./routes/chat.routes";
import smartRoutes from "./routes/smart.route";
import authRoutes from "./routes/auth.routes";
import { authMiddleware } from "./middlewares/authMiddleware";

// Load env variables
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Route 1: Todo Routes
app.use("/api/todos", authMiddleware, todoRoutes);
// Route 2: Chat Routes
app.use("/api/chat", chatRoutes);
// Route 3: Smart Todo Routes
app.use("/api/todos/smart", smartRoutes);
// Route 4: Auth Routes
app.use("/api/auth", authRoutes);

// Start the server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
