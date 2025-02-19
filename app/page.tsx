"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import { User, Lock, LogIn } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Logging in with:", username, password)
    localStorage.setItem("jwtToken", "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhbG91bG91QGdtYWlsLmNvbSIsImlhdCI6MTczOTg5NTcwOSwiZXhwIjoxNzM5OTgyMTA5fQ.BCrHLoP-i898mrhfQeuG8frtVRX85k8m4IY3wSGx0EI") // ✅ Store token
    router.push("/application/dashboard")
  }

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
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
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
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                onClick={handleLogin}
                className="bg-pastel-purple hover:bg-pastel-purple/80 text-gray-800 font-semibold py-2 px-4 rounded-full transition-all duration-300 hover:shadow-md flex items-center"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

