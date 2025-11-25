"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatInterface from "@/app/chat/ChatInterface";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 shadow-xl flex items-center justify-center text-white text-2xl hover:bg-blue-700 transition-all z-50"
      >
        🤖
      </button>

      {/* Popup Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 w-[350px] h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
              <h2 className="text-lg font-semibold">AI Assistant</h2>
              <button onClick={() => setOpen(false)} className="text-xl hover:text-gray-200">
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-hidden">
              <ChatInterface popupMode={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
