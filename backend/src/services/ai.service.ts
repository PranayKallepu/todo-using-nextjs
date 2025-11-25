import prisma from "../config/prisma";
import { analyzeText } from "./nlp.service";

export const processChatAI = async (message: string, userId: number) => {
  // 1️⃣ Analyze the user message using NLP
  const intent = await analyzeText(message);
  // console.log("INTENT:", intent);

  // 2️⃣ Perform actions based on intent type
  switch (intent.type) {

    // -----------------------------------------
    // CREATE TASK
    // -----------------------------------------
    case "create": {
      const todo = await prisma.todo.create({
        data: {
          title: intent.title || "New Task",
          dueDate: intent.dueDate || null,
          priority: intent.priority || null,
          recurrence: intent.recurrence || null,
          tags: intent.tags || [],
          userId,
        },
      });

      return `✅ Task created: "${todo.title}"`;
    }

    // -----------------------------------------
    // LIST TASKS
    // -----------------------------------------
    case "list": {
      let filter: any = { userId };

      if (intent.range === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        filter.dueDate = {
          gte: today,
          lt: tomorrow,
        };
      }

      if (intent.range === "tomorrow") {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const next = new Date(tomorrow);
        next.setDate(next.getDate() + 1);

        filter.dueDate = {
          gte: tomorrow,
          lt: next,
        };
      }

      if (intent.range === "nextWeek") {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        filter.dueDate = {
          gte: today,
          lt: nextWeek,
        };
      }

      const todos = await prisma.todo.findMany({
        where: filter,
        orderBy: { dueDate: "asc" },
      });

      if (todos.length === 0) {
        return "📭 You have no tasks in this time range.";
      }

      const list = todos.map(t => `• ${t.title}`).join("\n");
      return `📝 Here are your tasks:\n${list}`;
    }

    // -----------------------------------------
    // MARK AS DONE
    // -----------------------------------------
    case "markDone": {
      const todo = await prisma.todo.findFirst({
        where: {
          title: {
            contains: intent.title || "",
            mode: "insensitive"
          },
          userId
        }
      });

      if (!todo) return `❌ No task found: "${intent.title}"`;

      await prisma.todo.update({
        where: { id: todo.id },
        data: { completed: true }
      });

      return `🏁 Marked as done: "${todo.title}"`;
    }

    // -----------------------------------------
    // DELETE TASK
    // -----------------------------------------
    case "delete": {
      const todo = await prisma.todo.findFirst({
        where: {
          title: {
            contains: intent.title || "",
            mode: "insensitive"
          },
          userId
        }
      });

      if (!todo) return `❌ Could not find any task like "${intent.title}"`;

      await prisma.todo.delete({
        where: { id: todo.id }
      });

      return `🗑️ Deleted: "${todo.title}"`;
    }

    // -----------------------------------------
    // UPDATE TASK
    // -----------------------------------------
    case "update": {
      const todo = await prisma.todo.findFirst({
        where: {
          title: {
            contains: intent.title || "",
            mode: "insensitive"
          },
          userId
        }
      });

      if (!todo) return `❌ No task found to update: "${intent.title}"`;

      await prisma.todo.update({
        where: { id: todo.id },
        data: {
          dueDate: intent.newDueDate || todo.dueDate
        }
      });

      return `🛠️ Updated "${todo.title}" with new schedule.`;
    }

    // -----------------------------------------
    // UNKNOWN
    // -----------------------------------------
    default:
      return "🤔 Sorry, I didn’t understand that. Try again.";
  }
};
