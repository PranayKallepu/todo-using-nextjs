"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  fetchTodos,
  createTodo,
  deleteTodoApi,
  toggleTodoApi,
  updateTodoApi,
} from "@/app/lib/api";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
// import ChatWidget from "./components/ChatWidget";

type Todo = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string | null;
  priority?: "HIGH" | "MEDIUM" | "LOW" | null;
  tags?: string[];
};

const timeFilters = ["all", "today", "tomorrow", "week", "overdue"] as const;
const statusFilters = ["all", "completed", "pending"] as const;
const priorityOptions = ["ALL", "HIGH", "MEDIUM", "LOW"] as const;

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  console.log(todos); // empty array
  const [loading, setLoading] = useState(false);

  // AUTH
  const { token, user, authLoading, logout } = useAuth();

  console.log("AUTH STATE →", { authLoading, token, user });

  // FILTER STATES
  const [timeFilter, setTimeFilter] =
    useState<(typeof timeFilters)[number]>("all");
  const [statusFilter, setStatusFilter] =
    useState<(typeof statusFilters)[number]>("all");
  const [priorityFilter, setPriorityFilter] =
    useState<(typeof priorityOptions)[number]>("ALL");
  const [search, setSearch] = useState("");

  // NEW TODO FORM
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "MEDIUM",
    tags: "",
  });

  // EDIT MODAL
  const [editing, setEditing] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSaving, setModalSaving] = useState(false);

  // TIME FILTER RANGE
  const range = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    if (timeFilter === "today") {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return { from: start.toISOString(), to: end.toISOString() };
    }

    if (timeFilter === "tomorrow") {
      start.setDate(start.getDate() + 1);
      start.setHours(0, 0, 0, 0);

      end.setDate(end.getDate() + 1);
      end.setHours(23, 59, 59, 999);

      return { from: start.toISOString(), to: end.toISOString() };
    }

    if (timeFilter === "week") {
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() + 7);
      end.setHours(23, 59, 59, 999);

      return { from: start.toISOString(), to: end.toISOString() };
    }

    if (timeFilter === "overdue") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return {
        from: undefined,
        to: new Date(today.getTime() - 1).toISOString(),
      };
    }

    return { from: undefined, to: undefined };
  }, [timeFilter]);

  // REFRESH TODOS
  const refresh = useCallback(async () => {
    if (!token || !user?.id) return;

    console.log("REFRESH RUN");

    setLoading(true);
    try {
      const filters: any = { userId: user.id };

      if (range.from) filters.from = range.from;
      if (range.to) filters.to = range.to;
      if (priorityFilter !== "ALL") filters.priority = priorityFilter;
      if (statusFilter === "completed") filters.completed = true;
      else if (statusFilter === "pending") filters.completed = false;
      if (search.trim()) filters.search = search.trim();

      console.log("FILTERS SENT →", filters);

      const data = await fetchTodos(token, filters);
      console.log("TODOS RECEIVED →", data);

      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Refresh Error:", err);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  }, [
    token,
    user?.id,
    range.from,
    range.to,
    priorityFilter,
    statusFilter,
    search,
  ]);

  console.log("authLoading:", authLoading, "token:", token, "user:", user);

  useEffect(() => {
    if (authLoading) return;
    if (!token || !user?.id) return;
    refresh();
  }, [authLoading, token, user?.id, refresh]);

  useEffect(() => {
    if (authLoading) return;
    if (!token || !user?.id) return;
    refresh();
  }, [
    authLoading,
    token,
    user?.id,
    refresh,
    timeFilter,
    statusFilter,
    priorityFilter,
  ]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (token && user?.id) refresh();
    }, 450);
    return () => clearTimeout(t);
  }, [search, refresh, token, user?.id]);

  // CREATE TODO
  const handleCreate = async () => {
    if (!newTodo.title.trim()) return alert("Title required");
    if (!token) return alert("Not authenticated");
    if (!user?.id) return alert("User not authenticated");

    await createTodo(token, {
      title: newTodo.title.trim(),
      description: newTodo.description || null,
      dueDate: newTodo.dueDate || null,
      priority: newTodo.priority,
      tags: newTodo.tags ? newTodo.tags.split(",").map((t) => t.trim()) : [],
      userId: user.id,
    });

    setNewTodo({
      title: "",
      description: "",
      dueDate: "",
      priority: "MEDIUM",
      tags: "",
    });

    refresh();
  };

  // DELETE TODO
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this task?")) return;
    await deleteTodoApi(token, id);
    refresh();
  };

  // TOGGLE TODO
  const handleToggle = async (id: number, completed: boolean) => {
    await toggleTodoApi(token, id, completed);
    refresh();
  };

  // OPEN EDIT MODAL
  const openEditModal = (todo: Todo) => {
    setEditing({ ...todo });
    setIsModalOpen(true);
  };

  // SAVE CHANGES
  const saveEdit = async () => {
    if (!editing) return;

    setModalSaving(true);
    try {
      await updateTodoApi(token, editing.id, {
        title: editing.title,
        description: editing.description,
        dueDate: editing.dueDate || null,
        priority: editing.priority,
        tags: editing.tags || [],
      });

      setIsModalOpen(false);
      setEditing(null);
      refresh();
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setModalSaving(false);
    }
  };

  // AUTH CHECK
  if (authLoading) return <p>Loading...</p>;
  if (!user) {
    redirect("/login");
    return null;
  }

  return (
    <main className="min-h-screen text-white bg-gradient-to-br from-slate-900 via-slate-800 to-black p-10 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold">Your Tasks</h1>
            <p className="text-gray-300 mt-1">
              Manage tasks quickly with filters and AI assistant
            </p>
            {user && (
              <h3 className="text-xl font-bold mb-4">
                Hi {user.name?.split(" ")[0] || "User"}, today you have{" "}
                <span className="text-blue-600">{todos.length}</span> tasks.
              </h3>
            )}
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white/6 p-4 rounded-xl border border-white/8 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Time filters */}
            {timeFilters.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  timeFilter === tf ? "bg-white/20" : "bg-white/5"
                }`}
              >
                {tf === "all" ? "All" : tf[0].toUpperCase() + tf.slice(1)}
              </button>
            ))}

            {/* Status filters */}
            <div className="ml-3 flex items-center gap-2">
              {statusFilters.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusFilter === s ? "bg-white/20" : "bg-white/5"
                  }`}
                >
                  {s === "all" ? "All" : s[0].toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Right side: priority + search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              className="bg-white/5 p-2 rounded"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
            >
              {priorityOptions.map((p) => (
                <option key={p} value={p} className="text-black">
                  {p === "ALL" ? "All Priorities" : p}
                </option>
              ))}
            </select>

            <input
              placeholder="Search tasks..."
              className="bg-white/5 p-2 rounded "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Create Task */}
        <div className="bg-white/6 backdrop-blur p-4 rounded-xl border border-white/8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="bg-white/5 p-2 rounded"
              placeholder="Title"
              value={newTodo.title}
              onChange={(e) =>
                setNewTodo({ ...newTodo, title: e.target.value })
              }
            />

            <select
              value={newTodo.priority}
              onChange={(e) =>
                setNewTodo({ ...newTodo, priority: e.target.value })
              }
              className="bg-white/5 p-2 rounded"
            >
              <option value="LOW" className="text-black">Low</option>
              <option value="MEDIUM" className="text-black">Medium</option>
              <option value="HIGH" className="text-black">High</option>
            </select>

            <input
              className="bg-white/5 p-2 rounded md:col-span-2"
              placeholder="Description (optional)"
              value={newTodo.description}
              onChange={(e) =>
                setNewTodo({ ...newTodo, description: e.target.value })
              }
            />

            <input
              type="date"
              className="bg-white/5 p-2 rounded"
              value={newTodo.dueDate}
              onChange={(e) =>
                setNewTodo({ ...newTodo, dueDate: e.target.value })
              }
            />

            <input
              className="bg-white/5 p-2 rounded"
              placeholder="Tags (comma separated)"
              value={newTodo.tags}
              onChange={(e) => setNewTodo({ ...newTodo, tags: e.target.value })}
            />

            <div className="flex gap-2 md:col-span-2 mt-2">
              <button
                onClick={handleCreate}
                className="bg-green-600 px-4 py-2 rounded"
              >
                Add Task
              </button>

              <button
                onClick={() =>
                  setNewTodo({
                    title: "",
                    description: "",
                    dueDate: "",
                    priority: "MEDIUM",
                    tags: "",
                  })
                }
                className="bg-white/5 px-4 py-2 rounded"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading && (
            <div className="text-center text-gray-300">Loading...</div>
          )}
          {!loading && todos.length === 0 && (
            <div className="text-center text-gray-400 py-10">
              No tasks found
            </div>
          )}

          {todos.map((todo) => (
            <div
              key={todo.id}
              className="bg-white/6 p-4 rounded-xl border border-white/8 flex justify-between items-start"
            >
              <div className="flex gap-3 items-start">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo.id, !todo.completed)}
                  className="mt-1"
                />

                <div>
                  <div className="flex items-center gap-3">
                    <h3
                      className={`text-lg font-semibold ${
                        todo.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {todo.title}
                    </h3>

                    {todo.priority && (
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          todo.priority === "HIGH"
                            ? "bg-red-600"
                            : todo.priority === "MEDIUM"
                            ? "bg-yellow-600"
                            : "bg-green-600"
                        }`}
                      >
                        {todo.priority}
                      </span>
                    )}
                  </div>

                  {todo.description && (
                    <p className="text-gray-300 mt-1">{todo.description}</p>
                  )}

                  <div className="flex gap-2 mt-2 flex-wrap">
                    {todo.dueDate && (
                      <span className="bg-blue-700 text-xs px-2 py-1 rounded">
                        ⏰ {new Date(todo.dueDate).toLocaleString()}
                      </span>
                    )}
                    {todo.tags?.map((t, i) => (
                      <span
                        key={i}
                        className="bg-purple-700 text-xs px-2 py-1 rounded"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(todo)}
                    className="bg-white/5 px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-red-400 px-3 py-1"
                  >
                    Delete
                  </button>
                </div>
                <div className="text-sm text-gray-400">
                  {todo.dueDate
                    ? new Date(todo.dueDate).toLocaleDateString()
                    : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editing && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              if (!modalSaving) setIsModalOpen(false);
            }}
          />

          <div className="relative w-full max-w-2xl bg-slate-900 text-white rounded-xl p-6 z-60">
            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>

            <div className="grid gap-3">
              <input
                className="bg-white/5 p-2 rounded text-black"
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
              />

              <textarea
                className="bg-white/5 p-2 rounded text-black"
                value={editing.description || ""}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
              />

              <div className="flex gap-2">
                <input
                  type="date"
                  className="bg-white/5 p-2 rounded text-black"
                  value={editing.dueDate ? editing.dueDate.split("T")[0] : ""}
                  onChange={(e) =>
                    setEditing({ ...editing, dueDate: e.target.value })
                  }
                />

                <select
                  className="bg-white/5 p-2 rounded text-black"
                  value={editing.priority || "MEDIUM"}
                  onChange={(e) =>
                    setEditing({ ...editing, priority: e.target.value as any })
                  }
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>

                <input
                  className="bg-white/5 p-2 rounded text-black flex-1"
                  placeholder="Tags (comma separated)"
                  value={(editing.tags || []).join(",")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      tags: e.target.value
                        ? e.target.value.split(",").map((t) => t.trim())
                        : [],
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => {
                    if (!modalSaving) {
                      setIsModalOpen(false);
                      setEditing(null);
                    }
                  }}
                  className="bg-white/5 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="bg-green-600 px-4 py-2 rounded"
                >
                  {modalSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </main>
  );
}
