"use client";
import React from "react";

export default function Filters({
  timeFilters,
  timeFilter,
  setTimeFilter,
  statusFilters,
  statusFilter,
  setStatusFilter,
  priorityOptions,
  priorityFilter,
  setPriorityFilter,
  search,
  setSearch
}) {
  return (
    <div className="bg-white/6 p-4 rounded-xl border border-white/8 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

      {/* Left side filters */}
      <div className="flex items-center gap-2 flex-wrap">
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

      {/* Right: priority + search */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select
          className="bg-white/5 p-2 rounded"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          {priorityOptions.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search..."
          className="bg-white/5 p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

    </div>
  );
}
