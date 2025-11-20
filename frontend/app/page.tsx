"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all todos
  const getTodos = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5000/api/todos");
    const data = await res.json();
    setTodos(data);
    setLoading(false);
  };

  // Add new todo
  const addTodo = async () => {
    if (!title.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
    };

    // Optimistic UI update
    setTodos([newTodo, ...todos]);
    setTitle("");

    await fetch("http://localhost:5000/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    getTodos();
  };

  // Toggle completed status
  const toggleTodo = async (id: number, completed: boolean) => {
    // Optimistic UI
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed } : todo
      )
    );

    await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });

    getTodos();
  };

  // Delete todo
  const deleteTodo = async (id: number) => {
    // Confirm
    if (!confirm("Delete this task?")) return;

    // Optimistic UI
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "DELETE",
    });

    getTodos();
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-xl bg-white shadow p-6 rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">To-do App</h1>

        {/* Add Todo */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a task..."
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={addTodo}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        {loading && <p className="text-center">Loading...</p>}

        {/* Todo List */}
        <ul className="space-y-2 ">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-3 border rounded"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={(e) =>
                    toggleTodo(todo.id, e.target.checked)
                  }
                />
                <span
                  className={`${
                    todo.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.title}
                </span>
              </div>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
