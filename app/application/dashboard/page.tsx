"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {Grid2x2Check , Calendar, GraduationCap, Users, BookOpen } from "lucide-react"
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { LineChart, Line } from "recharts"
import { motion } from "framer-motion"

const features = [
  {
    title: "Students",
    description: "Manage student records",
    color: "bg-pastel-blue",
    icon: Users,
    link: "/application/students",
  },
  {
    title: "Teachers",
    description: "Oversee teacher information",
    color: "bg-pastel-yellow",
    icon: GraduationCap,
    link: "/application/teachers",
  },
  {
    title: "Departments",
    description: "Manage departments",
    color: "bg-pastel-purple",
    icon: Grid2x2Check ,
    link: "/application/departments",
  },
  {
    title: "Schedule",
    description: "View and manage class schedules",
    color: "bg-pastel-pink",
    icon: Calendar,
    link: "/application/schedule",
  },
]

const studentEnrollmentData = [
  { month: "Jan", count: 150 },
  { month: "Feb", count: 180 },
  { month: "Mar", count: 200 },
  { month: "Apr", count: 220 },
  { month: "May", count: 250 },
  { month: "Jun", count: 280 },
]

const averageGradesData = [
  { subject: "Math", grade: 85 },
  { subject: "Science", grade: 78 },
  { subject: "English", grade: 82 },
  { subject: "History", grade: 75 },
  { subject: "Art", grade: 90 },
]

const attendanceData = [
  { month: "Jan", attendance: 95 },
  { month: "Feb", attendance: 93 },
  { month: "Mar", attendance: 97 },
  { month: "Apr", attendance: 96 },
  { month: "May", attendance: 98 },
  { month: "Jun", attendance: 97 },
]

export default function DashboardPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl font-bold text-gray-900"
      >
        Welcome to EduManage Pro
      </motion.h1>
      <motion.p
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-xl text-gray-600"
      >
        Streamline your educational management with our comprehensive tools.
      </motion.p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
          >
            <Link href={feature.link}>
              <Card className={`${feature.color} transition-all duration-300 hover:shadow-lg cursor-pointer`}>
                <CardHeader>
                  <feature.icon className="h-8 w-8 mb-2 text-gray-700" />
                  <CardTitle className="text-lg font-semibold text-gray-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-2xl font-bold tracking-tight text-gray-900 mt-8"
      >
        Analytics
      </motion.h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Student Enrollment</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={studentEnrollmentData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Average Grades by Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsBarChart data={averageGradesData}>
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="grade" fill="#82ca9d" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={attendanceData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="attendance" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

