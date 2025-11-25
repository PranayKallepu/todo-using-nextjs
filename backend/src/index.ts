import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import todoRoutes from "./routes/todoRoutes";
import chatRoutes from "./routes/chat.routes";
import smartRoutes from "./routes/smart.route";


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route 1: Todo Routes
app.use("/api/todos", todoRoutes);
// Route 2: Chat Routes
app.use("/api/chat", chatRoutes);
// Route 3: Smart Todo Routes
app.use("/api/todos/smart", smartRoutes);


// Start the server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
