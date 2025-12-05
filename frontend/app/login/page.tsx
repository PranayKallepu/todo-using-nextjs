"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError("");

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      login(data.token, data.user);
      router.push("/");
    } else {
      setError(data.error || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/30 animate-fadeIn">
        <h1 className="text-3xl font-extrabold text-white text-center mb-6 drop-shadow-lg">
          AI Powered TO-DO
        </h1>

        {error && (
          <p className="text-red-300 text-sm mb-3 text-center">{error}</p>
        )}

        <div className="mb-4">
          <label className="text-white font-semibold text-sm">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full mt-1 p-3 rounded-xl bg-white/30 text-white placeholder-white/60 border border-white/40 focus:border-white focus:ring-0"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-5 relative">
          <label className="text-white font-semibold text-sm">Password</label>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full mt-1 p-3 rounded-xl bg-white/30 text-white placeholder-white/60 border border-white/40 focus:border-white focus:ring-0"
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-10 cursor-pointer text-white/80 hover:text-white"
          >
            {showPassword ? <Eye /> :<EyeOff />}
          </span>
        </div>

        <button
          onClick={handleLogin}
          className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg shadow-lg hover:opacity-90 transition-all"
        >
          Login
        </button>

        <p className="mt-5 text-center text-white/80 text-sm">
          Don’t have an account?{" "}
          <span
            className="text-white font-semibold cursor-pointer hover:underline"
            onClick={() => router.push("/register")}
          >
            Create one
          </span>
        </p>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
      `}</style>
    </div>
  );
}
