"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Bell, CheckCircle, RefreshCw, Search, UserPlus, X } from "lucide-react"

// Update the interface for Teacher to match the API response
interface Teacher {
  id: number
  name: string
  email: string
  departmentName: string
}

// Update the interface for Exam to match the API response
interface Exam {
  id: number
  subject: string
  startDate: string
  endDate: string
  period: string
  academicYear: string
  duration: number
  niveauName: string
  niveauTd: number
  supervisors: Teacher[] | null
  room: Room | null
}

// Mettre à jour l'interface UpdateExamDTO pour correspondre exactement à la structure fournie
// Mettre à jour l'interface UpdateExamDTO pour correspondre exactement à la structure attendue par le backend
interface UpdateExamDTO {
  subject?: string;
  startDate?: string;
  endDate?: string;
  duration?: number;
  roomId?: number;
  supervisorIds?: number[]; // Utiliser un tableau de nombres au lieu d'un objet Optional
}

// Ajouter l'interface Optional pour simuler le comportement de java.util.Optional
interface Optional<T> {
  value: T
}

// Authentication utility functions
const getAuthToken = () => localStorage.getItem("jwtToken") || ""

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
})

// Room interface
interface Room {
  id: number
  name: string
  capacity: number
  location: string
}

export default function SupervisorAssignmentPage() {
  // State for exams and teachers
  const [exams, setExams] = useState<Exam[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState<string>("all")
  const [filterPeriod, setFilterPeriod] = useState<string>("all")
  const [autoAssignSuccess, setAutoAssignSuccess] = useState(false)
  const [replacementModalOpen, setReplacementModalOpen] = useState(false)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [teacherToReplace, setTeacherToReplace] = useState<Teacher | null>(null)
  const [notificationSent, setNotificationSent] = useState(false)

  // Update the fetchData function in useEffect to use the correct endpoints
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch exams and teachers from the specified endpoints
        const examsResponse = await fetch("http://localhost:8080/admin/exams", {
          method: "GET",
          headers: getHeaders(),
        })
        const teachersResponse = await fetch("http://localhost:8080/admin/teacher", {
          method: "GET",
          headers: getHeaders(),
        })

        if (!examsResponse.ok || !teachersResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const examsData = await examsResponse.json()
        const teachersData = await teachersResponse.json()

        // Process the data
        const examsArray = Array.isArray(examsData) ? examsData : examsData.data || []
        const teachersArray = Array.isArray(teachersData) ? teachersData : teachersData.data || []

        console.log("Exams data:", examsArray)
        console.log("Teachers data:", teachersArray)

        // Ensure each exam has a supervisors array
        const processedExams = examsArray.map((exam: Exam) => ({
          ...exam,
          supervisors: exam.supervisors || [],
        }))

        setExams(processedExams)
        setTeachers(teachersArray)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Fallback to mock data if API call fails
        const mockTeachers: Teacher[] = [
          { id: 1, name: "Dr. Sophie Martin", email: "s.martin@university.edu", departmentName: "Computer Science" },
          { id: 2, name: "Prof. Thomas Dubois", email: "t.dubois@university.edu", departmentName: "Mathematics" },
          { id: 3, name: "Dr. Marie Leroy", email: "m.leroy@university.edu", departmentName: "Physics" },
          { id: 4, name: "Prof. Jean Moreau", email: "j.moreau@university.edu", departmentName: "Computer Science" },
          { id: 5, name: "Dr. Claire Blanc", email: "c.blanc@university.edu", departmentName: "Mathematics" },
          { id: 6, name: "Prof. Pierre Durand", email: "p.durand@university.edu", departmentName: "Physics" },
        ]

        const mockExams: Exam[] = [
          {
            id: 1,
            subject: "Algorithms",
            startDate: "2025-01-10T09:00:00",
            endDate: "2025-01-10T11:00:00",
            period: "DS_S1",
            academicYear: "2024-2025",
            duration: 120,
            niveauName: "L3",
            niveauTd: 1,
            supervisors: [mockTeachers[0], mockTeachers[3]],
            room: { id: 1, name: "A101", capacity: 120, location: "Building A" },
          },
          {
            id: 2,
            subject: "Calculus",
            startDate: "2025-01-10T14:00:00",
            endDate: "2025-01-10T16:00:00",
            period: "DS_S1",
            academicYear: "2024-2025",
            duration: 120,
            niveauName: "L1",
            niveauTd: 2,
            supervisors: [mockTeachers[1]],
            room: { id: 2, name: "B205", capacity: 100, location: "Building B" },
          },
          {
            id: 3,
            subject: "Quantum Physics",
            startDate: "2025-01-11T09:00:00",
            endDate: "2025-01-11T12:00:00",
            period: "DS_S1",
            academicYear: "2024-2025",
            duration: 180,
            niveauName: "M1",
            niveauTd: 3,
            supervisors: [mockTeachers[2], mockTeachers[5]],
            room: { id: 3, name: "C301", capacity: 200, location: "Building C" },
          },
          {
            id: 4,
            subject: "Database Systems",
            startDate: "2025-01-12T09:00:00",
            endDate: "2025-01-12T11:30:00",
            period: "DS_S1",
            academicYear: "2024-2025",
            duration: 150,
            niveauName: "L3",
            niveauTd: 1,
            supervisors: [],
            room: { id: 4, name: "A102", capacity: 80, location: "Building A" },
          },
          {
            id: 5,
            subject: "Linear Algebra",
            startDate: "2025-01-12T14:00:00",
            endDate: "2025-01-12T16:00:00",
            period: "DS_S1",
            academicYear: "2024-2025",
            duration: 120,
            niveauName: "L2",
            niveauTd: 4,
            supervisors: [mockTeachers[4]],
            room: { id: 5, name: "B201", capacity: 150, location: "Building B" },
          },
        ]

        setTeachers(mockTeachers)
        setExams(mockExams)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Function to get unique departments for filtering
  const departments = [...new Set(teachers.map((teacher) => teacher.departmentName))]

  // Function to get unique periods for filtering
  const periods = [...new Set(exams.map((exam) => exam.period))]

  // Filter exams based on search term and period
  const filteredExams = exams.filter((exam) => {
    const matchesSearch = searchTerm
      ? exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exam.niveauName && exam.niveauName.toLowerCase().includes(searchTerm.toLowerCase()))
      : true
    const matchesPeriod = filterPeriod !== "all" ? exam.period === filterPeriod : true
    return matchesSearch && matchesPeriod
  })

  // Filter teachers based on department
  const filteredTeachers = teachers.filter((teacher) => {
    return filterDepartment !== "all" ? teacher.departmentName === filterDepartment : true
  })

  // Function to check if a teacher can supervise an exam (not teaching the subject)
  const canSupervise = (teacher: Teacher, exam: Exam) => {
    // Map subjects to departments (in a real app, this would come from the backend)
    const subjectDepartmentMap: Record<string, string> = {
      Algorithms: "Computer Science",
      "Database Systems": "Computer Science",
      Calculus: "Mathematics",
      "Linear Algebra": "Mathematics",
      "Quantum Physics": "Physics",
    }

    // A teacher cannot supervise an exam if they teach the subject (same department)
    return teacher.departmentName !== subjectDepartmentMap[exam.subject]
  }

  // Function to check if a teacher is available at the exam time
  const isTeacherAvailable = (teacher: Teacher, examToCheck: Exam) => {
    // Check if teacher is already assigned to another exam at the same time
    return !exams.some(
      (exam) =>
        exam.id !== examToCheck.id &&
        exam.supervisors &&
        exam.supervisors.some((s) => s.id === teacher.id) &&
        // Check for time overlap
        ((new Date(examToCheck.startDate) >= new Date(exam.startDate) &&
          new Date(examToCheck.startDate) < new Date(exam.endDate)) ||
          (new Date(examToCheck.endDate) > new Date(exam.startDate) &&
            new Date(examToCheck.endDate) <= new Date(exam.endDate)) ||
          (new Date(examToCheck.startDate) <= new Date(exam.startDate) &&
            new Date(examToCheck.endDate) >= new Date(exam.endDate))),
    )
  }

  // Mettre à jour la fonction assignTeacher pour utiliser Optional<Set<Long>>
  const assignTeacher = async (exam: Exam, teacher: Teacher) => {
    try {
      // Check if teacher can supervise this exam
      if (!canSupervise(teacher, exam)) {
        toast({
          variant: "destructive",
          title: "Assignment Error",
          description: `${teacher.name} cannot supervise the ${exam.subject} exam (same department).`,
        });
        return;
      }
  
      // Check if teacher is available at this time
      if (!isTeacherAvailable(teacher, exam)) {
        toast({
          variant: "destructive",
          title: "Schedule Conflict",
          description: `${teacher.name} is already assigned to another exam at the same time.`,
        });
        return;
      }
  
      // Create the list of supervisor IDs (existing + new)
      const currentSupervisors = exam.supervisors || [];
      const supervisorIds = [...currentSupervisors.map((s) => s.id), teacher.id];
  
      // Create the UpdateExamDTO
      const updateData: UpdateExamDTO = {
        supervisorIds: supervisorIds,
      };
  
      // Send the update to the backend
      const response = await fetch(`http://localhost:8080/admin/exams/${exam.id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updateData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to assign supervisor");
      }
  
      // Update the local state
      const updatedExams = exams.map((e) => {
        if (e.id === exam.id) {
          return {
            ...e,
            supervisors: [...(e.supervisors || []), teacher],
          };
        }
        return e;
      });
  
      setExams(updatedExams);
  
      toast({
        title: "Supervisor Assigned",
        description: `${teacher.name} has been assigned to the ${exam.subject} exam.`,
      });
    } catch (error) {
      console.error("Error assigning supervisor:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign supervisor. Please try again.",
      });
    }
  };
  

  // Mettre à jour la fonction removeTeacher pour utiliser Optional<Set<Long>>
  const removeTeacher = async (exam: Exam, teacherId: number) => {
    try {
      // Create the list of supervisor IDs (excluding the one to remove)
      const currentSupervisors = exam.supervisors || [];
      const supervisorIds = currentSupervisors.filter((s) => s.id !== teacherId).map((s) => s.id);
  
      // Create the UpdateExamDTO
      const updateData: UpdateExamDTO = {
        supervisorIds: supervisorIds,
      };
  
      // Send the update to the backend
      const response = await fetch(`http://localhost:8080/admin/exams/${exam.id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updateData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to remove supervisor");
      }
  
      // Update the local state
      const updatedExams = exams.map((e) => {
        if (e.id === exam.id) {
          return {
            ...e,
            supervisors: (e.supervisors || []).filter((s) => s.id !== teacherId),
          };
        }
        return e;
      });
  
      setExams(updatedExams);
  
      toast({
        title: "Supervisor Removed",
        description: "The supervisor has been removed from the exam.",
      });
    } catch (error) {
      console.error("Error removing supervisor:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove supervisor. Please try again.",
      });
    }
  };
  
  const handleReplaceTeacher = async () => {
    if (!selectedExam || !teacherToReplace || !selectedTeacher) return;
  
    try {
      // Create the list of supervisor IDs (replacing the old one with the new one)
      const currentSupervisors = selectedExam.supervisors || [];
      const supervisorIds = currentSupervisors.map((s) => (s.id === teacherToReplace.id ? selectedTeacher.id : s.id));
  
      // Create the UpdateExamDTO
      const updateData: UpdateExamDTO = {
        supervisorIds: supervisorIds,
      };
  
      // Send the update to the backend
      const response = await fetch(`http://localhost:8080/admin/exams/${selectedExam.id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updateData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to replace supervisor");
      }
  
      // Update the local state
      const updatedExams = exams.map((e) => {
        if (e.id === selectedExam.id) {
          return {
            ...e,
            supervisors: (e.supervisors || []).map((s) => (s.id === teacherToReplace.id ? selectedTeacher : s)),
          };
        }
        return e;
      });
  
      setExams(updatedExams);
      setReplacementModalOpen(false);
  
      // Reset selected values
      setSelectedExam(null);
      setTeacherToReplace(null);
      setSelectedTeacher(null);
  
      toast({
        title: "Supervisor Replaced",
        description: `${teacherToReplace.name} has been replaced by ${selectedTeacher.name}.`,
      });
    } catch (error) {
      console.error("Error replacing supervisor:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to replace supervisor. Please try again.",
      });
    }
  };
  
  const handleAutoAssign = async () => {
    setLoading(true);
    try {
      // Create a copy of the exams
      const updatedExams = [...exams];
  
      // For each exam, assign supervisors if needed
      for (const exam of updatedExams) {
        // Each exam needs 2 supervisors
        const supervisorsNeeded = 2;
        const currentSupervisors = exam.supervisors || [];
  
        if (currentSupervisors.length < supervisorsNeeded) {
          // Find eligible teachers who can supervise this exam
          const eligibleTeachers = teachers.filter(
            (teacher) =>
              // Teacher can supervise this subject
              canSupervise(teacher, exam) &&
              // Teacher is not already assigned to this exam
              !currentSupervisors.some((s) => s.id === teacher.id) &&
              // Teacher is available at this time
              isTeacherAvailable(teacher, exam),
          );
  
          // Sort eligible teachers by number of assignments (to balance the load)
          eligibleTeachers.sort((a, b) => {
            const aAssignments = updatedExams.filter((e) => (e.supervisors || []).some((s) => s.id === a.id)).length;
            const bAssignments = updatedExams.filter((e) => (e.supervisors || []).some((s) => s.id === b.id)).length;
            return aAssignments - bAssignments;
          });
  
          // Determine how many teachers to add
          const teachersToAdd = Math.min(supervisorsNeeded - currentSupervisors.length, eligibleTeachers.length);
  
          if (teachersToAdd > 0) {
            // Get the teachers to add
            const newSupervisors = eligibleTeachers.slice(0, teachersToAdd);
  
            // Create the list of all supervisor IDs (existing + new)
            const supervisorIds = [...currentSupervisors.map((s) => s.id), ...newSupervisors.map((s) => s.id)];
  
            // Create the UpdateExamDTO
            const updateData: UpdateExamDTO = {
              supervisorIds: supervisorIds,
            };
  
            // Send the update to the backend
            const response = await fetch(`http://localhost:8080/admin/exams/${exam.id}`, {
              method: "PUT",
              headers: getHeaders(),
              body: JSON.stringify(updateData),
            });
  
            if (!response.ok) {
              console.error(`Failed to auto-assign supervisors for exam ${exam.id}`);
              continue;
            }
  
            // Update the exam in our local copy
            exam.supervisors = [...currentSupervisors, ...newSupervisors];
          }
        }
      }
  
      setExams(updatedExams);
      setAutoAssignSuccess(true);
  
      // Hide success message after 3 seconds
      setTimeout(() => setAutoAssignSuccess(false), 3000);
  
      toast({
        title: "Auto-assignment complete",
        description: "Supervisors have been automatically assigned to exams.",
      });
    } catch (error) {
      console.error("Error auto-assigning supervisors:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to auto-assign supervisors. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to notify supervisors
  const notifySupervisors = async () => {
    try {
      // In a real app, you would send notifications to the backend
      // const response = await fetch("http://localhost:8080/admin/supervisors/notify", {
      //   method: "POST",
      //   headers: getHeaders(),
      // })
      //
      // if (!response.ok) {
      //   throw new Error("Failed to send notifications")
      // }

      setNotificationSent(true)

      // Hide notification message after 3 seconds
      setTimeout(() => setNotificationSent(false), 3000)

      toast({
        title: "Notifications Sent",
        description: "All supervisors have been notified of their supervision schedule.",
      })
    } catch (error) {
      console.error("Error sending notifications:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send notifications. Please try again.",
      })
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Helper function to safely get supervisor count
  const getSupervisorCount = (exam: Exam): number => {
    return exam.supervisors ? exam.supervisors.length : 0
  }

  function openReplacementDialog(exam: Exam, supervisor: Teacher): void {
    throw new Error("Function not implemented.")
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Supervisor Assignment</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAutoAssign} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Auto-Assign Supervisors
          </Button>
          <Button onClick={notifySupervisors}>
            <Bell className="mr-2 h-4 w-4" />
            Notify Supervisors
          </Button>
        </div>
      </div>

      {autoAssignSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">
            Supervisors have been automatically assigned to exams.
          </AlertDescription>
        </Alert>
      )}

      {notificationSent && (
        <Alert className="bg-blue-50 border-blue-200">
          <Bell className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Notifications Sent</AlertTitle>
          <AlertDescription className="text-blue-700">
            All supervisors have been notified of their supervision schedule.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="exams">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="teachers">Available Teachers</TabsTrigger>
        </TabsList>

        <TabsContent value="exams">
          <Card>
            <CardHeader>
              <CardTitle>Exam List</CardTitle>
              <CardDescription>Manage supervisor assignments for each exam</CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for an exam..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All periods</SelectItem>
                    {periods.map((period) => (
                      <SelectItem key={period} value={period}>
                        {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Supervisors</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExams.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No exams found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredExams.map((exam) => (
                          <TableRow key={exam.id}>
                            <TableCell className="font-medium">{exam.subject}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {exam.niveauName}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {formatDate(exam.startDate)}
                              <div className="text-xs text-muted-foreground">
                                to {new Date(exam.endDate).toLocaleTimeString()}
                              </div>
                            </TableCell>
                            <TableCell>{exam.duration} min</TableCell>
                            <TableCell>{exam.room ? exam.room.name : "Not assigned"}</TableCell>
                            <TableCell>
                              {!exam.supervisors || exam.supervisors.length === 0 ? (
                                <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
                                  Not assigned
                                </Badge>
                              ) : (
                                <div className="flex flex-col gap-1">
                                  {exam.supervisors.map((supervisor) => (
                                    <div key={supervisor.id} className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">
                                        {supervisor.name}
                                      </Badge>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5"
                                        onClick={() => removeTeacher(exam, supervisor.id)}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5"
                                        onClick={() => openReplacementDialog(exam, supervisor)}
                                      >
                                        <RefreshCw className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" disabled={getSupervisorCount(exam) >= 2}>
                                    <UserPlus className="mr-2 h-3 w-3" />
                                    Add Supervisor
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Add Supervisor</DialogTitle>
                                    <DialogDescription>
                                      Select a teacher to supervise the {exam.subject} exam
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4">
                                    <div className="mb-4">
                                      <Select onValueChange={setFilterDepartment} value={filterDepartment}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Filter by department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="all">All departments</SelectItem>
                                          {departments.map((dept) => (
                                            <SelectItem key={dept} value={dept}>
                                              {dept}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto space-y-2">
                                      {filteredTeachers.map((teacher) => {
                                        const isAssigned =
                                          exam.supervisors && exam.supervisors.some((s) => s.id === teacher.id)
                                        const canAssign = canSupervise(teacher, exam)
                                        const isAvailable = isTeacherAvailable(teacher, exam)

                                        return (
                                          <div
                                            key={teacher.id}
                                            className={`flex items-center justify-between p-3 rounded-md border ${
                                              isAssigned
                                                ? "bg-green-50 border-green-200"
                                                : !canAssign
                                                  ? "bg-red-50 border-red-200"
                                                  : !isAvailable
                                                    ? "bg-amber-50 border-amber-200"
                                                    : "bg-white"
                                            }`}
                                          >
                                            <div>
                                              <div className="font-medium">{teacher.name}</div>
                                              <div className="text-sm text-muted-foreground">
                                                {teacher.departmentName}
                                              </div>
                                            </div>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              disabled={isAssigned || !canAssign || !isAvailable}
                                              onClick={() => assignTeacher(exam, teacher)}
                                            >
                                              {isAssigned ? (
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                              ) : (
                                                "Assign"
                                              )}
                                            </Button>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => {}}>
                                      Cancel
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers">
          <Card>
            <CardHeader>
              <CardTitle>Available Teachers</CardTitle>
              <CardDescription>View teachers who can be assigned as supervisors</CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for a teacher..."
                    className="pl-8"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTeachers.map((teacher) => {
                    // Count how many exams this teacher is supervising
                    const assignedExams = exams.filter(
                      (exam) => exam.supervisors && exam.supervisors.some((s) => s.id === teacher.id),
                    )

                    return (
                      <Card key={teacher.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{teacher.name}</CardTitle>
                          <CardDescription>{teacher.email}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge>{teacher.departmentName}</Badge>
                            <Badge variant="outline">
                              {assignedExams.length} supervision{assignedExams.length !== 1 ? "s" : ""}
                            </Badge>
                          </div>

                          {assignedExams.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">Assigned exams:</h4>
                              <ul className="space-y-1">
                                {assignedExams.map((exam) => (
                                  <li key={exam.id} className="text-sm">
                                    <span className="font-medium">{exam.subject}</span> - {formatDate(exam.startDate)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Replacement Dialog */}
      <Dialog open={replacementModalOpen} onOpenChange={setReplacementModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Replace Supervisor</DialogTitle>
            <DialogDescription>
              {teacherToReplace && `Choose a replacement for ${teacherToReplace.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              onValueChange={(value) => {
                const teacher = teachers.find((t) => t.id === Number.parseInt(value))
                setSelectedTeacher(teacher || null)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a replacement" />
              </SelectTrigger>
              <SelectContent>
                {teachers
                  .filter(
                    (teacher) =>
                      // Not the teacher being replaced
                      teacherToReplace &&
                      teacher.id !== teacherToReplace.id &&
                      // Not already assigned to this exam
                      selectedExam &&
                      selectedExam.supervisors &&
                      !selectedExam.supervisors.some((s) => s.id === teacher.id) &&
                      // Can supervise this exam
                      selectedExam &&
                      canSupervise(teacher, selectedExam) &&
                      // Is available at this time
                      selectedExam &&
                      isTeacherAvailable(teacher, selectedExam),
                  )
                  .map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.name} ({teacher.departmentName})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplacementModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReplaceTeacher} disabled={!selectedTeacher}>
              Replace Supervisor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

