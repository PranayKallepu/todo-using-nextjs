export const API_BASE = "http://localhost:5000";

export async function createTodo(data: any) {
  const res = await fetch(`${API_BASE}/api/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  console.log("Create Todo Response:", res);
  return res.json();
}

export async function updateTodoApi(id: number, data: any) {
  const res = await fetch(`${API_BASE}/api/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTodoApi(id: number) {
  return await fetch(`${API_BASE}/api/todos/${id}`, { method: "DELETE" });
}

export async function toggleTodoApi(id: number, completed: boolean) {
  return await updateTodoApi(id, { completed });
}

export async function sendChatMessage(message: string) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      userId: 1,
    }),
  });
  return res.json();
}

const qs = (obj: Record<string, any>) => {
  const entries = Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(
      ([k, v]) =>
        `${encodeURIComponent(k)}=${encodeURIComponent(
          Array.isArray(v) ? v.join(",") : v
        )}`
    );
  return entries.length ? `?${entries.join("&")}` : "";
};

export async function fetchTodos(filters?: {
  userId?: number;
  from?: string; // ISO date
  to?: string; // ISO date
  priority?: string; // HIGH|MEDIUM|LOW
  completed?: boolean;
  search?: string;
}) {
  // If any date range / priority / completed filter present, call the filter endpoint
  if (filters && (filters.from || filters.to || filters.priority || filters.completed !== undefined || filters.search)) {
    const params = {
      userId: filters.userId ?? 1,
      from: filters.from,
      to: filters.to,
      priority: filters.priority,
      completed: filters.completed === undefined ? undefined : String(filters.completed),
      search: filters.search,
    };
    const url = `${API_BASE}/api/todos/filter${qs(params)}`;
    const res = await fetch(url);
    return res.json();
  }

  // fallback - fetch all
  const res = await fetch(`${API_BASE}/api/todos`);
  return res.json();
}




