"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

// API functions
import {
  fetchTodos,
  createTodo,
  deleteTodoApi,
  toggleTodoApi,
  updateTodoApi,
} from "@/app/lib/api";

// Components
import Filters from "@/app/components/Filters";
import TodoList from "@/app/components/TodoList";
import NewTodoForm from "@/app/components/NewTodoForm";
import EditTodoModal from "@/app/components/EditTodoModal";

export default function TodosPage() {
  const { token, user, authLoading } = useAuth();

  const [todos, setTodos] = useState([]);

  const [search, setSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const [editing, setEditing] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const timeFilters = ["all", "today", "tomorrow", "week"];
  const statusFilters = ["all", "pending", "completed"];
  const priorityOptions = ["all", "low", "medium", "high"];

  // -----------------------------------------------------------------------
  //  REFRESH FUNCTION  (LOAD ALL TODOS)
  // -----------------------------------------------------------------------
  const refresh = useCallback(async () => {
    if (!token || !user?.id) return;

    try {
      const data = await fetchTodos(token, user.id);
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos", error);
    }
  }, [token, user]);

  // -----------------------------------------------------------------------
  //  FIXED: INITIAL LOAD EFFECT (NOW WORKS)
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!authLoading && token && user?.id) {
      refresh();
    }
  }, [authLoading, token, user?.id, refresh]);

  // -----------------------------------------------------------------------
  //  FILTERING + SEARCH
  // -----------------------------------------------------------------------
  const filteredTodos = useMemo(() => {
    let items = [...todos];

    // Status filter
    if (statusFilter !== "all") {
      items = items.filter((t) => t.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      items = items.filter((t) => t.priority === priorityFilter);
    }

    // Search filter
    if (search.trim() !== "") {
      items = items.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    return items;
  }, [todos, search, statusFilter, priorityFilter]);

  // -----------------------------------------------------------------------
  //  FILTER CHANGE → RELOAD TODOS FROM BACKEND
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!authLoading && token && user?.id) {
      refresh();
    }
  }, [authLoading, timeFilter, statusFilter, priorityFilter, refresh]);

  // -----------------------------------------------------------------------
  //  CRUD HANDLERS
  // -----------------------------------------------------------------------

  const handleCreate = async () => {
    if (!newTodo.title.trim()) return;

    try {
      await createTodo(token, user.id, newTodo);
      setNewTodo({ title: "", description: "", dueDate: "" });
      refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      await toggleTodoApi(token, id, completed);
      refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodoApi(token, id);
      refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const saveEdit = async () => {
    try {
      await updateTodoApi(token, editing.id, editing);
      setIsEditOpen(false);
      refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const openEditModal = (todo) => {
    setEditing(todo);
    setIsEditOpen(true);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* Filters */}
      <Filters
        timeFilters={timeFilters}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        statusFilters={statusFilters}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityOptions={priorityOptions}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        search={search}
        setSearch={setSearch}
      />

      {/* Add Todo */}
      <NewTodoForm
        newTodo={newTodo}
        setNewTodo={setNewTodo}
        handleCreate={handleCreate}
      />

      {/* Todo List */}
      <TodoList
        todos={filteredTodos}
        handleToggle={handleToggle}
        handleDelete={handleDelete}
        openEditModal={openEditModal}
      />

      {/* Edit Modal */}
      <EditTodoModal
        isOpen={isEditOpen}
        editing={editing}
        setEditing={setEditing}
        saveEdit={saveEdit}
        close={() => setIsEditOpen(false)}
      />
    </div>
  );
}
