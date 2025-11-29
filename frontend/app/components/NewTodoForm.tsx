"use client";
import React from "react";

export default function NewTodoForm({ newTodo, setNewTodo, handleCreate }) {
  return (
    <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6">

      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 bg-white/10 rounded mb-2"
        value={newTodo.title}
        onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
      />

      <textarea
        placeholder="Description"
        className="w-full p-2 bg-white/10 rounded mb-2"
        value={newTodo.description}
        onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
      />

      <input
        type="date"
        className="w-full p-2 bg-white/10 rounded mb-2"
        value={newTodo.dueDate}
        onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
      />

      <button onClick={handleCreate} className="bg-blue-600 w-full py-2 rounded">
        Add Task
      </button>
    </div>
  );
}
