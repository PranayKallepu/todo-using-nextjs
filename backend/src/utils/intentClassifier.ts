export const classifyIntent = (text: string) => {
  const cleaned = text.toLowerCase().trim().replace(/\s+/g, " ");

  // CREATE TASK
  if (
    cleaned.startsWith("add ") ||
    cleaned.startsWith("create ") ||
    cleaned.includes("remind me to") ||
    cleaned.includes("i need to ") ||
    cleaned.includes("i have to ")
  ) {
    return "create";
  }

  // LIST TASKS
  if (
    cleaned.includes("what do i have") ||
    cleaned.includes("show my") ||
    cleaned.includes("list my tasks") ||
    cleaned.includes("agenda") ||
    cleaned.includes("tasks for") ||
    cleaned.includes("what are my tasks")
  ) {
    return "list";
  }

  // MARK AS DONE
  if (cleaned.includes("mark") && cleaned.includes("done")) {
    return "markDone";
  }

  // DELETE TASK
  if (
    cleaned.startsWith("delete ") ||
    cleaned.startsWith("remove ") ||
    cleaned.includes("delete task") ||
    cleaned.includes("remove task")
  ) {
    return "delete";
  }

  // UPDATE TASK
  if (
    cleaned.includes("update ") ||
    cleaned.includes("change ") ||
    cleaned.includes("move ") ||
    cleaned.includes("reschedule")
  ) {
    return "update";
  }

  return "unknown";
};
