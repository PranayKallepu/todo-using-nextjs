"use client";
import React from "react";

export default function TodoList({ todos, handleToggle, handleDelete, openEditModal }) {
  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <div key={todo.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between">
          
          <div>
            <h3 className="text-xl font-semibold">{todo.title}</h3>
            {todo.description && <p className="text-gray-300">{todo.description}</p>}
          </div>

          <div className="flex gap-2">
            <button onClick={() => openEditModal(todo)} className="px-3 py-1 bg-blue-500 rounded">Edit</button>
            <button onClick={() => handleToggle(todo.id, !todo.completed)} className="px-3 py-1 bg-green-500 rounded">
              {todo.completed ? "Undo" : "Done"}
            </button>
            <button onClick={() => handleDelete(todo.id)} className="px-3 py-1 bg-red-500 rounded">Delete</button>
          </div>

        </div>
      ))}
    </div>
  );
}
