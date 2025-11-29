"use client";

import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import { sendChatMessage } from "../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function ChatInterface({ popupMode = false }) {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! How can I help you with your tasks today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    setLoading(true);

    try {
      const res = await sendChatMessage(token,input);
      const aiMessage = { sender: "ai", text: res.reply };
      console.log("aiMessage", aiMessage)

      setMessages(prev => [...prev, aiMessage]);
      window.dispatchEvent(new Event("todos-updated"));
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "⚠️ Something went wrong. Try again." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className={`flex flex-col ${popupMode ? "h-full" : "w-full max-w-2xl"} bg-white`}>
      
      {/* Hide header when popupMode = true */}
      {!popupMode && (
        <div className="px-4 py-3 border-b">
          <h2 className="text-xl font-semibold text-gray-800">AI Task Assistant</h2>
          <p className="text-sm text-gray-500">Chat with your AI to manage tasks</p>
        </div>
      )}

      {/* Chat Window */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        {messages.map((msg, index) => (
          <MessageBubble key={index} sender={msg.sender} text={msg.text} />
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm animate-pulse">
              Typing...
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-2 border-t p-3 bg-white">
        <input
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none"
          placeholder="Ex: Add a task to buy groceries"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
