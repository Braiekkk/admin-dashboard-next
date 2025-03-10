"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, Calendar, CheckCircle, Plus, Search, X } from "lucide-react"
import type { Room, Exam, Niveau } from "@/app/interfaces"

// Authentication utility functions
const getAuthToken = () => localStorage.getItem("jwtToken") || ""

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
})

export default function RoomManagement() {
  // State for rooms, exams and levels
  const [rooms, setRooms] = useState<Room[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [niveaux, setNiveaux] = useState<Niveau[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLocation, setFilterLocation] = useState<string>("")
  const [filterCapacity, setFilterCapacity] = useState<string>("")
  const [filterNiveau, setFilterNiveau] = useState<string>("all")
  const [filterPeriod, setFilterPeriod] = useState<string>("all")
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [reservationDate, setReservationDate] = useState<string>("")
  const [reservationStartTime, setReservationStartTime] = useState<string>("")
  const [reservationDuration, setReservationDuration] = useState<number>(120)
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false)

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch rooms, exams and levels from API with authentication headers
        const roomsResponse = await fetch("http://localhost:8080/admin/rooms", {
          method: "GET",
          headers: getHeaders(),
        })
        const examsResponse = await fetch("http://localhost:8080/admin/exams", {
          method: "GET",
          headers: getHeaders(),
        })
        const niveauxResponse = await fetch("http://localhost:8080/admin/niveau", {
          method: "GET",
          headers: getHeaders(),
        })

        if (!roomsResponse.ok || !examsResponse.ok || !niveauxResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const roomsData = await roomsResponse.json()
        const examsData = await examsResponse.json()
        const niveauxData = await niveauxResponse.json()

        // Check if roomsData is an array, if not, extract the array from the response
        const roomsArray = Array.isArray(roomsData)
          ? roomsData
          : roomsData.rooms
            ? roomsData.rooms
            : roomsData.data
              ? roomsData.data
              : []

        // Similarly for exams
        const examsArray = Array.isArray(examsData)
          ? examsData
          : examsData.exams
            ? examsData.exams
            : examsData.data
              ? examsData.data
              : []

        // Similarly for levels
        const niveauxArray = Array.isArray(niveauxData)
          ? niveauxData
          : niveauxData.niveaux
            ? niveauxData.niveaux
            : niveauxData.data
              ? niveauxData.data
              : []

        console.log("Rooms data:", roomsArray)
        console.log("Exams data:", examsArray)
        console.log("Levels data:", niveauxArray)

        // Format exam data to match our interface
        const formattedExams = examsArray.map((exam: {
          academicYear: string
          room: any; niveauName: any; id: any; subject: any; matiere: any; startDate: any; debut: any; duration: any; duree: any; room_id: { toString: () => any }; supervisors: any; year: any; annee: any; period: any; periode: any; endDate: any; 
          }) => {
          // Trouver le niveau correspondant à l'examen
          const niveau = niveauxArray.find((n: { name: any }) => n.name === exam.niveauName)

          return {
            id: exam.id,
            subject: exam.subject || "",
            date: exam.startDate || "",
            duration: exam.duration || 90,
            room: exam.room ? exam.room.id.toString() : "",
            room_id: exam.room ? exam.room.id : null,
            supervisors: exam.supervisors || [],
            year: exam.academicYear || "",
            period: exam.period || "",
            end_time: exam.endDate || "",
            niveau: exam.niveauName || "",
          }
        })


        setRooms(roomsArray)
        setExams(formattedExams)
        setNiveaux(niveauxArray)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Fallback to mock data if API call fails
        const mockRooms: Room[] = [
          { id: 1, name: "A101", capacity: 120, location: "Building A" },
          { id: 2, name: "A102", capacity: 80, location: "Building A" },
          { id: 3, name: "B201", capacity: 150, location: "Building B" },
          { id: 4, name: "B205", capacity: 100, location: "Building B" },
          { id: 5, name: "C301", capacity: 200, location: "Building C" },
          { id: 6, name: "C302", capacity: 60, location: "Building C" },
        ]

        const mockNiveaux: Niveau[] = [
          {
            id: 1, name: "L1",
            students: []
          },
          
        ]

        const mockExams: Exam[] = [
          {
            id: 1,
            subject: "Mathematics",
            date: "2024-11-17 08:00:00",
            duration: 90,
            room: "2",
            room_id: 2,
            supervisors: [],
            year: "2024-2025",
            period: "DS_S1",
            end_time: "2024-11-17 09:30:00",
            niveau_id: 1,
            niveau: "L1",
          },
          {
            id: 2,
            subject: "Physics",
            date: "2024-11-18 10:00:00",
            duration: 90,
            room: "2",
            room_id: 2,
            supervisors: [],
            year: "2024-2025",
            period: "DS_S1",
            end_time: "2024-11-18 11:30:00",
            niveau_id: 1,
            niveau: "L1",
          },
          {
            id: 3,
            subject: "Chemistry",
            date: "2024-11-19 08:00:00",
            duration: 90,
            room: "3",
            room_id: 3,
            supervisors: [],
            year: "2024-2025",
            period: "DS_S1",
            end_time: "2024-11-19 09:30:00",
            niveau_id: 2,
            niveau: "L2",
          },
          {
            id: 4,
            subject: "Computer Science",
            date: "2024-11-20 09:00:00",
            duration: 90,
            room: "",
            room_id: null,
            supervisors: [],
            year: "2024-2025",
            period: "DS_S1",
            end_time: "2024-11-20 10:30:00",
            niveau_id: 3,
            niveau: "L3",
          },
        ]

        setRooms(mockRooms)
        setExams(mockExams)
        setNiveaux(mockNiveaux)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Function to get unique locations for filtering
  const locations =
    rooms && Array.isArray(rooms) && rooms.length > 0 ? [...new Set(rooms.map((room) => room.location))] : []

  // Function to get unique periods for filtering
  const periods =
    exams && Array.isArray(exams) && exams.length > 0
      ? [...new Set(exams.filter((exam) => exam.period).map((exam) => exam.period))]
      : []

  // Function to get level name by ID
  const getLevelNameById = (levelId: number | null | string): string => {
    if (!levelId) return ""

    // Convert to string for comparison
    const levelIdStr = levelId.toString()

    const level = niveaux.find((n) => n.name.toString() === levelIdStr)
    return level ? level.name : ""
  }

  // Filter rooms based on search term and filters
  const filteredRooms =
    rooms && Array.isArray(rooms)
      ? rooms.filter((room) => {
          const matchesSearch =
            room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.location.toLowerCase().includes(searchTerm.toLowerCase())
          const matchesLocation = filterLocation && filterLocation !== "all" ? room.location === filterLocation : true
          const matchesCapacity =
            filterCapacity && filterCapacity !== "all"
              ? (filterCapacity === "small" && room.capacity <= 80) ||
                (filterCapacity === "medium" && room.capacity > 80 && room.capacity <= 150) ||
                (filterCapacity === "large" && room.capacity > 150)
              : true

          return matchesSearch && matchesLocation && matchesCapacity
        })
      : []

  // Filter exams based on level and search term
  const filteredExams =
    exams && Array.isArray(exams)
      ? exams.filter((exam) => {
          // Check if exam matches level filter
          const matchesLevel =
            !filterNiveau || filterNiveau === "all" ? true : exam.niveau?.toString() === filterNiveau

          // Check if exam matches period filter
          const matchesPeriod = !filterPeriod || filterPeriod === "all" ? true : exam.period === filterPeriod

          // Check if exam matches search term
          const matchesSearch = !searchTerm ? true : exam.subject.toLowerCase().includes(searchTerm.toLowerCase())

          console.log(
            `Exam ${exam.id} - Level ID: ${exam.niveau}, Period: ${exam.period}, Filter Level: ${filterNiveau}, Filter Period: ${filterPeriod}, Matches: ${matchesLevel && matchesPeriod && matchesSearch}`,
          )

          return matchesLevel && matchesPeriod && matchesSearch
        })
      : []

  // Debug logging
  useEffect(() => {
    console.log("Available levels:", niveaux)
    console.log("Current level filter:", filterNiveau)
    console.log("Exams before filtering:", exams)
    console.log("Exams after filtering:", filteredExams)

    // Display exam levels for verification
    exams.forEach((exam) => {
      console.log(`Exam ${exam.id} , Level: ${exam.niveau}`)
    })
  }, [filterNiveau, niveaux, exams, filteredExams])

  // Function to check if a room is available at a specific time
  const isRoomAvailable = (roomName: string, date: string, startTime: string, duration: number) => {
    const reservationStart = new Date(`${date}T${startTime}:00`)
    const reservationEnd = new Date(reservationStart.getTime() + duration * 60000)

    return !exams.some((exam) => {
      if (exam.room !== roomName) return false

      // If exam date is empty, consider the room available
      if (!exam.date) return false

      const examStart = new Date(exam.date.replace(" ", "T"))
      const examEnd = new Date(examStart.getTime() + exam.duration * 60000)

      return (
        (reservationStart >= examStart && reservationStart < examEnd) ||
        (reservationEnd > examStart && reservationEnd <= examEnd) ||
        (reservationStart <= examStart && reservationEnd >= examEnd)
      )
    })
  }

  // Function to reserve a room
  const reserveRoom = async () => {
    if (!selectedRoom || !selectedExam || !reservationDate || !reservationStartTime) {
      toast({
        variant: "destructive",
        title: "Reservation Error",
        description: "Please fill in all required fields.",
      })
      return
    }

    try {
      console.log("Making reservation...", {
        room: selectedRoom,
        exam: selectedExam,
        date: reservationDate,
        time: reservationStartTime,
        duration: reservationDuration,
      })

      // Calculate end time
      const startDateTime = new Date(`${reservationDate}T${reservationStartTime}:00`)
      const endDateTime = new Date(startDateTime.getTime() + reservationDuration * 60000)
      const endTimeString = endDateTime.toISOString().replace("T", " ").substring(0, 19)
      const startTimeString = startDateTime.toISOString().replace("T", " ").substring(0, 19)

      // Create the updated exam data
      const updatedExam = {
        ...selectedExam,
        room: selectedRoom.id.toString(),
        room_id: selectedRoom.id,
        date: startTimeString,
        start_time: startTimeString,
        debut: startTimeString,
        end_time: endTimeString,
        fin: endTimeString,
        duration: reservationDuration,
        duree: reservationDuration,
      }

      console.log("Updated exam data:", updatedExam)

      // Send the update to the API
      const response = await fetch(`http://localhost:8080/admin/exams/${selectedExam.id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updatedExam),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API error response:", errorText)
        throw new Error(`Failed to update exam: ${response.status} ${response.statusText}`)
      }

      // Update the local state
      const updatedExams = exams.map((exam) => {
        if (exam.id === selectedExam.id) {
          return updatedExam
        }
        return exam
      })

      setExams(updatedExams)
      setReservationDialogOpen(false)

      // Reset form
      setSelectedRoom(null)
      setSelectedExam(null)
      setReservationDate("")
      setReservationStartTime("")
      setReservationDuration(90)

      toast({
        title: "Reservation Complete",
        description: `Room ${selectedRoom.name} has been reserved for the ${selectedExam.subject} exam.`,
      })
    } catch (error) {
      console.error("Error updating exam:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while making the reservation.",
      })
    }
  }

  // Function to cancel a reservation
  const cancelReservation = async (examId: number) => {
    try {
      // Find the exam to update
      const examToUpdate = exams.find((exam) => exam.id === examId)

      if (!examToUpdate) {
        throw new Error("Exam not found")
      }

      console.log("Cancelling reservation for exam:", examToUpdate)

      // Create the updated exam data with empty room
      const updatedExam = {
        ...examToUpdate,
        room: "",
        room_id: null,
      }

      // Send the update to the API
      const response = await fetch(`http://localhost:8080/admin/exams/${examId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updatedExam),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API error response:", errorText)
        throw new Error(`Failed to update exam: ${response.status} ${response.statusText}`)
      }

      // Update the local state
      const updatedExams = exams.map((exam) => {
        if (exam.id === examId) {
          return {
            ...exam,
            room: "",
            room_id: null,
          }
        }
        return exam
      })

      setExams(updatedExams)

      toast({
        title: "Reservation Cancelled",
        description: "The room reservation has been cancelled.",
      })
    } catch (error) {
      console.error("Error canceling reservation:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while cancelling the reservation.",
      })
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) {
      // If date is empty, return empty string
      return ""
    }

    try {
      // Try different date formats
      let date

      // ISO standard format (2024-11-17T08:00:00)
      if (dateString.includes("T")) {
        date = new Date(dateString)
      }
      // Format with space (2024-11-17 08:00:00)
      else if (dateString.includes(" ")) {
        // Replace space with T for ISO format
        date = new Date(dateString.replace(" ", "T"))
      }
      // Date only format (2024-11-17)
      else {
        date = new Date(dateString)
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateString)
        return dateString
      }

      return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (error) {
      console.error("Error formatting date:", dateString, error)
      return dateString
    }
  }

  // Function to get room name by ID
  const getRoomNameById = (roomId: number | null): string => {
    if (!roomId) return "Not assigned"
    const room = rooms.find((r) => r.id === roomId)
    return room ? room.name : roomId.toString()
  }

  // Get filtered exams for a specific room based on the current period filter
  const getFilteredRoomExams = (roomId: number) => {
    return exams.filter((exam) => {
      const matchesPeriod = !filterPeriod || filterPeriod === "all" ? true : exam.period === filterPeriod
      return exam.room_id === roomId && matchesPeriod
    })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Room Management</h1>
      </div>

      <Tabs defaultValue="rooms">
        <TabsList className="mb-4">
          <TabsTrigger value="rooms">Available Rooms</TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms">
          <Card>
            <CardHeader>
              <CardTitle>Room List</CardTitle>
              <CardDescription>View available rooms and their capacity</CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for a room..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by building" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All buildings</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterCapacity} onValueChange={setFilterCapacity}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All capacities</SelectItem>
                    <SelectItem value="small">Small (&lt; 80)</SelectItem>
                    <SelectItem value="medium">Medium (80-150)</SelectItem>
                    <SelectItem value="large">Large (&gt; 150)</SelectItem>
                  </SelectContent>
                </Select>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRooms.map((room) => {
                    // Get exams scheduled in this room, filtered by period
                    const roomExams = getFilteredRoomExams(room.id)

                    return (
                      <Card key={room.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl">{room.name}</CardTitle>
                          <CardDescription>{room.location}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 mb-4">
                            <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50">
                              Capacity: {room.capacity} seats
                            </Badge>
                            <Badge variant="outline">
                              {roomExams.length} reservation{roomExams.length !== 1 ? "s" : ""}
                            </Badge>
                          </div>

                          {roomExams.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">Scheduled Exams:</h4>
                              <ul className="space-y-1">
                                {roomExams.map((exam) => {
                                  const levelName = getLevelNameById(exam.niveau)
                                  return (
                                    <li key={exam.id} className="text-sm">
                                      <span className="font-medium">{exam.subject}</span>
                                      {exam.date && ` - ${formatDate(exam.date)}`}
                                      {levelName && (
                                        <span className="ml-1 text-xs text-muted-foreground">({levelName})</span>
                                      )}
                                    </li>
                                  )
                                })}
                              </ul>
                            </div>
                          )}

                          <Button
                            variant="outline"
                            className="w-full mt-4"
                            onClick={() => {
                              setSelectedRoom(room)
                              setReservationDialogOpen(true)
                            }}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Reserve
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reservations">
          <Card>
            <CardHeader>
              <CardTitle>Room Reservations</CardTitle>
              <CardDescription>Manage room reservations for exams</CardDescription>
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
                <Select value={filterNiveau} onValueChange={setFilterNiveau}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All levels</SelectItem>
                    {niveaux.map((niveau) => (
                      <SelectItem key={niveau.id} value={niveau.name}>
                        {niveau.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                        <TableHead>Status</TableHead>
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
                        filteredExams.map((exam) => {
                          const levelName = getLevelNameById(exam.niveau)
                          return (
                            <TableRow key={exam.id}>
                              <TableCell className="font-medium">{exam.subject}</TableCell>
                              <TableCell>
                                {levelName ? (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    {levelName}
                                  </Badge>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell>{exam.date ? formatDate(exam.date) : "Not scheduled"}</TableCell>
                              <TableCell>{exam.duration} min</TableCell>
                              <TableCell>
                                {exam.room_id ? (
                                  <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">
                                    {getRoomNameById(exam.room_id)}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
                                    Not assigned
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {exam.room_id ? (
                                  <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    <span>Reserved</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                                    <span>Pending</span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {exam.room_id ? (
                                  <Button variant="outline" size="sm" onClick={() => cancelReservation(exam.id)}>
                                    <X className="mr-2 h-3 w-3" />
                                    Cancel
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedExam(exam)
                                      setReservationDialogOpen(true)

                                      // If exam already has a date, use it to pre-fill the form
                                      if (exam.date) {
                                        try {
                                          let date
                                          if (exam.date.includes("T")) {
                                            date = new Date(exam.date)
                                          } else if (exam.date.includes(" ")) {
                                            date = new Date(exam.date.replace(" ", "T"))
                                          } else {
                                            date = new Date(exam.date)
                                          }

                                          if (!isNaN(date.getTime())) {
                                            setReservationDate(date.toISOString().split("T")[0])
                                            setReservationStartTime(
                                              `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`,
                                            )
                                            setReservationDuration(exam.duration)
                                          }
                                        } catch (error) {
                                          console.error("Error converting date:", exam.date, error)
                                          // In case of error, initialize with today's date
                                          const today = new Date()
                                          setReservationDate(today.toISOString().split("T")[0])
                                          setReservationStartTime("08:00")
                                        }
                                      } else {
                                        // If exam has no date, initialize with today's date
                                        const today = new Date()
                                        setReservationDate(today.toISOString().split("T")[0])
                                        setReservationStartTime("08:00")
                                      }
                                    }}
                                  >
                                    <Calendar className="mr-2 h-3 w-3" />
                                    Reserve
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reservation Dialog */}
      <Dialog open={reservationDialogOpen} onOpenChange={setReservationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reserve a Room</DialogTitle>
            <DialogDescription>Select a room for the exam</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="exam" className="text-right">
                Exam
              </label>
              <Select
                onValueChange={(value) => {
                  console.log("Selected exam:", value)
                  const exam = exams.find((e) => e.id === Number.parseInt(value))
                  setSelectedExam(exam || null)

                  // Extract date and time from the exam
                  if (exam && exam.date) {
                    try {
                      let date
                      if (exam.date.includes("T")) {
                        date = new Date(exam.date)
                      } else if (exam.date.includes(" ")) {
                        date = new Date(exam.date.replace(" ", "T"))
                      } else {
                        date = new Date(exam.date)
                      }

                      if (!isNaN(date.getTime())) {
                        setReservationDate(date.toISOString().split("T")[0])
                        setReservationStartTime(
                          `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`,
                        )
                        setReservationDuration(exam.duration)
                      }
                    } catch (error) {
                      console.error("Error converting date:", exam.date, error)
                    }
                  }

                  // If exam already has an assigned room, select it
                  if (exam && exam.room_id) {
                    const room = rooms.find((r) => r.id === exam.room_id)
                    if (room) {
                      setSelectedRoom(room)
                    }
                  } else {
                    setSelectedRoom(null)
                  }
                }}
                value={selectedExam?.id.toString() || ""}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select an exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((exam) => {
                    const levelName = getLevelNameById(exam.niveau)
                    return (
                      <SelectItem key={exam.id} value={exam.id.toString()}>
                        {exam.subject} {levelName && `(${levelName})`} {exam.date && `- ${formatDate(exam.date)}`}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {selectedExam && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="room" className="text-right">
                    Room
                  </label>
                  <Select
                    onValueChange={(value) => {
                      console.log("Selected room:", value)
                      const room = rooms.find((r) => r.id === Number.parseInt(value))
                      setSelectedRoom(room || null)
                    }}
                    value={selectedRoom?.id.toString() || ""}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id.toString()}>
                          {room.name} ({room.capacity} seats)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="date" className="text-right">
                    Date
                  </label>
                  <div className="col-span-3 p-2 bg-muted rounded-md">
                    {reservationDate ? new Date(reservationDate).toLocaleDateString("en-US") : "Not defined"}
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="time" className="text-right">
                    Start Time
                  </label>
                  <div className="col-span-3 p-2 bg-muted rounded-md">{reservationStartTime || "Not defined"}</div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="duration" className="text-right">
                    Duration
                  </label>
                  <div className="col-span-3 p-2 bg-muted rounded-md">
                    {reservationDuration ? `${reservationDuration} minutes` : "Not defined"}
                  </div>
                </div>

                {reservationDate && reservationStartTime && reservationDuration && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="endTime" className="text-right">
                      End Time
                    </label>
                    <div className="col-span-3 p-2 bg-muted rounded-md">
                      {(() => {
                        try {
                          const startDate = new Date(`${reservationDate}T${reservationStartTime}:00`)
                          if (isNaN(startDate.getTime())) {
                            return "Invalid start time"
                          }
                          const endDate = new Date(startDate.getTime() + reservationDuration * 60000)
                          return endDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                        } catch (error) {
                          console.error("Error calculating end time:", error)
                          return "Unable to calculate end time"
                        }
                      })()}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReservationDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log("Reserve button clicked", {
                  selectedRoom,
                  selectedExam,
                  reservationDate,
                  reservationStartTime,
                })
                reserveRoom()
              }}
              disabled={!selectedRoom || !selectedExam || !reservationDate || !reservationStartTime}
            >
              Reserve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

