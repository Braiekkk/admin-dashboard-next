import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, GraduationCap, Users, BookOpen } from "lucide-react"
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { LineChart, Line } from "recharts"

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
    title: "Courses",
    description: "Manage course offerings",
    color: "bg-pastel-purple",
    icon: BookOpen,
    link: "/application/courses",
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

export default function ApplicationHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">Welcome to EduManage Pro</h1>
      <p className="text-xl text-gray-600">Streamline your educational management with our comprehensive tools.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Link href={feature.link} key={index}>
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
        ))}
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-8">Analytics</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </div>
  )
}

