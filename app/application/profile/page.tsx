"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { User, Mail, Briefcase, Key, Save } from "lucide-react"

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Administrator",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSave = () => {
    // Here you would typically send the updated data to a server
    console.log("Saving user data:", userData)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-gray-900"
      >
        Profile
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center">
              <User className="mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="text-gray-500" />
              <Label htmlFor="name" className="text-sm font-medium text-gray-500">
                Name
              </Label>
              {isEditing ? (
                <Input id="name" name="name" value={userData.name} onChange={handleInputChange} className="flex-grow" />
              ) : (
                <p className="text-lg text-gray-900">{userData.name}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="text-gray-500" />
              <Label htmlFor="email" className="text-sm font-medium text-gray-500">
                Email
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="flex-grow"
                />
              ) : (
                <p className="text-lg text-gray-900">{userData.email}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Briefcase className="text-gray-500" />
              <Label htmlFor="role" className="text-sm font-medium text-gray-500">
                Role
              </Label>
              <p className="text-lg text-gray-900">{userData.role}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center">
              <Key className="mr-2" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <Button onClick={handleSave} className="bg-pastel-green hover:bg-pastel-green/80 text-white">
                <Save className="mr-2" />
                Save Changes
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="bg-pastel-blue hover:bg-pastel-blue/80 text-white">
                Edit Profile
              </Button>
            )}
            <Button className="bg-pastel-yellow hover:bg-pastel-yellow/80 text-gray-800">Change Password</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

