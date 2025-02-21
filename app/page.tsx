"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { User, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // ✅ Store login errors
  const [loading, setLoading] = useState<boolean>(false); // ✅ Show loading state
  const router = useRouter();

  /** ✅ Handles login request */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: username, // ✅ Adjusted to "email" as per API
          password: password,
          role: "ADMIN"
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Login failed");
      }

      const token = responseData.data?.token; // ✅ Extract token

      if (token) {
        localStorage.setItem("jwtToken", token); // ✅ Store token in localStorage
        router.push("/application/dashboard"); // ✅ Redirect on success
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pastel-blue to-pastel-purple">
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-[350px] bg-white shadow-lg">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
            >
              <CardTitle className="text-2xl font-bold text-gray-800">Welcome to EduManage Pro</CardTitle>
            </motion.div>
            <CardDescription className="text-gray-600">Please log in to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Email
                </Label>
                <Input
                  id="username"
                  placeholder="Enter your email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-pastel-blue focus:border-pastel-purple"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-pastel-blue focus:border-pastel-purple"
                />
              </div>

              {error && <p className="text-center text-red-500">{error}</p>} {/* ✅ Show error message */}
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                onClick={handleLogin}
                disabled={loading} // ✅ Disable button when loading
                className="bg-pastel-purple hover:bg-pastel-purple/80 text-gray-800 font-semibold py-2 px-4 rounded-full transition-all duration-300 hover:shadow-md flex items-center"
              >
                {loading ? "Logging in..." : <><LogIn className="w-4 h-4 mr-2" /> Login</>}
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
