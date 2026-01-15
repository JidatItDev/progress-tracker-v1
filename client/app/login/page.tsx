"use client";

import { JSX, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const mockUsers = {
        "admin@jidat.com": {
          id: "1",
          name: "Admin User",
          role: "admin",
          permissions: {
            overview: { view: true },
            projects: { view: true, create: true, delete: true },
            milestones: { view: true, create: true, delete: true },
            clients: { view: true, create: true },
            activity: { view: true },
            users: { view: true, create: true },
            admin: { view: true },
          },
        },

        "client@jidat.com": {
          id: "2",
          name: "Client User",
          role: "client",
          permissions: {
            overview: { view: true },
            projects: { view: true },
            milestones: { view: true },
            activity: { view: true },
          },
        },

        "user@jidat.com": {
          id: "3",
          name: "Developer User",
          role: "user",
          permissions: {
            overview: { view: true },
            projects: { view: true },
            milestones: { view: true },
            activity: { view: false },
          },
        },
      } as const;

      const user = mockUsers[email as keyof typeof mockUsers];

      if (!user || password !== `${user.role}123`) {
        throw new Error("Invalid credentials");
      }




      setAuth({
        user,
        token: "mock-jwt-token",
      });

      router.replace("/pages/home");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left */}
        <div className="bg-gray-100 p-6 flex items-start">
          <h1 className="text-3xl font-semibold text-gray-900">
            Welcome to <br />
            <span className="font-medium">Jidat IT Progress Tracker</span>
          </h1>
        </div>

        {/* Right */}
        <div className="p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-red-600 text-sm font-medium">{error}</div>
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 text-base rounded-md focus:ring-2 focus:ring-pink-500 outline-none"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 text-base rounded-md focus:ring-2 focus:ring-pink-500 outline-none"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-3 rounded-md font-semibold hover:bg-pink-700 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

           
          </form>
        </div>
      </div>
    </div>
  );
}
