import * as chrono from "chrono-node";
import { Priority } from "@prisma/client";
import { parseNaturalDate } from "../utils/dateParser";
import { classifyIntent } from "../utils/intentClassifier";

/* ------------------------------------------------------
   SMART TODO PARSER (title, date, priority, recurrence)
------------------------------------------------------ */
export const parseSmartTodo = (text: string) => {
  const lower = text.toLowerCase();
  let title = text;
  let dueDate: Date | null = null;
  let priority: Priority | null = null;
  let recurrence: string | null = null;
  let tags: string[] = [];

  // DATE
  const parsedDate = chrono.parseDate(text);
  if (parsedDate) {
    dueDate = parsedDate;

    const parsedBlock = chrono.parse(text)[0];
    if (parsedBlock?.text) {
      title = title.replace(parsedBlock.text, "").trim();
    }
  }

  // PRIORITY
  if (lower.includes("high priority")) priority = "HIGH";
  if (lower.includes("medium priority")) priority = "MEDIUM";
  if (lower.includes("low priority")) priority = "LOW";

  // RECURRENCE
  if (lower.includes("every day")) recurrence = "daily";
  if (lower.includes("every week")) recurrence = "weekly";
  if (lower.includes("every month")) recurrence = "monthly";

  // TAGS
  const tagMatches = text.match(/#\w+/g);
  if (tagMatches) {
    tags = tagMatches.map((t) => t.replace("#", ""));
  }

  // FINAL CLEAN TITLE
  title = title
    .replace(/high priority|medium priority|low priority/gi, "")
    .trim();

  return {
    title: title || "Untitled Task",
    dueDate,
    priority,
    recurrence,
    tags,
  };
};

/* ------------------------------------------------------
            MAIN NLP INTENT ENGINE (Optimized)
------------------------------------------------------ */

export interface ParsedIntent {
  type: "create" | "update" | "delete" | "markDone" | "list" | "unknown";
  title?: string;
  newDueDate?: Date | null;
  range?: string | null;
  dueDate?: Date | null;
  priority?: Priority | null;
  recurrence?: string | null;
  tags?: string[];
}

export const analyzeText = async (text: string): Promise<ParsedIntent> => {
  const cleaned = text.toLowerCase().trim();
  const intentType = classifyIntent(cleaned);

  // 1️⃣ LIST INTENT
  if (intentType === "list") {
    const range = cleaned.includes("today")
      ? "today"
      : cleaned.includes("tomorrow")
      ? "tomorrow"
      : cleaned.includes("next week")
      ? "nextWeek"
      : null;
    return { type: "list", range };
  }

  // 2️⃣ MARK DONE INTENT
  if (intentType === "markDone") {
    const title = cleaned.replace("mark", "").replace("as done", "").trim();

    return { type: "markDone", title };
  }

  // 3️⃣ DELETE INTENT
  if (intentType === "delete") {
    const title = cleaned.replace("delete", "").replace("remove", "").trim();

    return { type: "delete", title };
  }

  // 4️⃣ UPDATE INTENT
  if (intentType === "update") {
    const parts = cleaned.split(" to ");

    const title = parts[0]
      .replace("update", "")
      .replace("change", "")
      .replace("reschedule", "")
      .trim();

    let newDueDate = null;
    if (parts[1]) {
      newDueDate = parseNaturalDate(parts[1]);
    }

    return { type: "update", title, newDueDate };
  }

  // 5️⃣ CREATE INTENT
  if (intentType === "create") {
    const parsed = parseSmartTodo(text);
    return {
      type: "create",
      ...parsed,
    };
  }

  // 6️⃣ UNKNOWN
  return { type: "unknown" };
};
