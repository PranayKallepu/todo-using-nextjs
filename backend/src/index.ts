import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import todoRoutes from "./routes/todoRoutes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// app.use("/", (req, res) => {
//   res.send("Hello World!...");
// });

app.use("/api/todos", todoRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
