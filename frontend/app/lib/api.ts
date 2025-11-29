export const API_BASE = "http://localhost:5000";

export async function createTodo(token: string, data: any) {
  const res = await fetch(`${API_BASE}/api/todos`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateTodoApi(token: string, id: number, data: any) {
  const res = await fetch(`${API_BASE}/api/todos/${id}`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteTodoApi(token: string, id: number) {
  return await fetch(`${API_BASE}/api/todos/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function toggleTodoApi(token: string, id: number, completed: boolean) {
  return await updateTodoApi(token, id, { completed });
}

export async function sendChatMessage(token: string, message: string) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", 
      Authorization: `Bearer ${token}`,
    },
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
          typeof v === "number" ? v : Array.isArray(v) ? v.join(",") : v
        )}`
    );
  return entries.length ? `?${entries.join("&")}` : "";
};

export async function fetchTodos(token: string, filters?: any) {
  console.log("api:", token);

  if (filters && Object.keys(filters).length > 0) {
const url = `${API_BASE}/api/todos/filter${qs(filters)}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  }

  const res = await fetch(`${API_BASE}/api/todos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}






