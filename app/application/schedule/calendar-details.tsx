"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddEventDialog } from "./add-event-dialog";
import { Period } from "@/app/interfaces";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { EventCarousel } from "./event-carousel";
import { CalendarEvent } from "@/app/interfaces";

const TITLE_OPTIONS = [
  "DS_S1",
  "Examen_S1",
  "DS_S2",
  "Examen_S2",

] as const;
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => {
  const year = CURRENT_YEAR - 2 + i;
  return `${year}-${year + 1}`;
});

const TD_OPTIONS = ["TD1", "TD2"];


interface CalendarDetailsProps {
  eventTitles: string[];
  selectedTD: string;
  periods: Period[];
  events: CalendarEvent[];
  selectedPeriodTitle: string;
  selectedYear: string;
  selectedGrade: string;
  onSelectedTDChange: (value: string) => void;
  onEventTitlesChange: (value: string[]) => void;
  onPeriodTitleChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onGradeChange: (value: string) => void;
  onEventsChange: (events: CalendarEvent[]) => void;
}

// Mock API function - replace with actual API call
// Simulated API function - Replace with actual API request

const fetchEvents = async (
  academicYear: string,
  period: string,
  niveauName: string,
  niveauTd: string
): Promise<{ CalendarEvents: CalendarEvent[]; EventTitles: string[] }> => {
  try {
    // Get JWT Token from local storage
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      console.log("No authentication token found");
      throw new Error("No authentication token found");
    }
    const td = niveauTd === "TD1" ? 1 : 2;
    // Construct query parameters
    const eventUrl = `http://localhost:8080/admin/exams/niveau?period=${encodeURIComponent(
      period
    )}&academicYear=${encodeURIComponent(
      academicYear
    )}&niveauName=${encodeURIComponent(
      niveauName
    )}&niveauTd=${encodeURIComponent(td)}`;

    // Fetch exams (events)
    const eventResponse = await fetch(eventUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!eventResponse.ok) {
      throw new Error("Failed to fetch events");
    }

    const eventData = await eventResponse.json();
    const exams = eventData.data || []; // Ensure it's an array

    // Convert exams to CalendarEvent format
    const CalendarEvents: CalendarEvent[] = exams.map((exam: any) => ({
      id: exam.id,
      title: exam.subject,
      start: new Date(exam.startDate),
      end: new Date(exam.endDate),
      duration: exam.duration,
      resourceId: exam.room?.roomId ?? undefined,
    }));

    // Fetch event titles (subjects) from niveau API
    const titleUrl = `http://localhost:8080/admin/niveau/specific?niveauName=${encodeURIComponent(
      niveauName
    )}`;

    const titleResponse = await fetch(titleUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!titleResponse.ok) {
      throw new Error("Failed to fetch event titles");
    }

    const titleData = await titleResponse.json();
    const eventTitles =
      titleData.data?.subjects?.split(",").map((subject: string) => subject.trim()) || [];

    console.log("EventTitles", eventTitles);
    console.log("CalendarEvents", CalendarEvents);

    return { CalendarEvents , EventTitles: eventTitles };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { CalendarEvents: [], EventTitles: [] };
  }
};


export function CalendarDetails({
  eventTitles,
  periods,
  events,
  selectedPeriodTitle,
  selectedYear,
  selectedGrade,
  selectedTD,
  onSelectedTDChange,
  onEventTitlesChange,
  onPeriodTitleChange,
  onYearChange,
  onGradeChange,
  onEventsChange,
}: CalendarDetailsProps) {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [grades, setGrades] = useState<string[]>([]);
  const [selectedPeriod , setSelectedPeriod] = useState<Period>();

  // Fetch events when filters change
  useEffect(() => {
    const getEvents = async () => {
      if (
        !selectedYear ||
        !selectedPeriodTitle ||
        !selectedGrade ||
        !selectedTD
      )
        return;

      setIsLoading(true);
      onEventsChange([]);
      setError("");

      try {
        const { CalendarEvents, EventTitles } = await fetchEvents(
          selectedYear,
          selectedPeriodTitle,
          selectedGrade,
          selectedTD
        );

        
        onEventsChange(CalendarEvents);
        onEventTitlesChange(EventTitles);
      } catch (err) {
        setError("Failed to load events. Please try again.");
        console.error("Error fetching events:", err);
      } finally {
        setIsLoading(false);
      }
    };



    getEvents();
  }, [
    selectedYear,
    selectedPeriodTitle,
    selectedGrade,
    selectedTD,
  ]);
  // Update selected period when period title or year changes
  useEffect(() => {

    const period = periods.find(
      (period) =>
        period.title === selectedPeriodTitle && period.year === selectedYear
    );
    setSelectedPeriod(period);
    
   },[selectedPeriodTitle, selectedYear])
  // Fetch grade options from API with JWT token
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const jwtToken = localStorage.getItem("jwtToken"); // Retrieve token
        if (!jwtToken) {
          throw new Error("No authentication token found");
        }

        const response = await fetch("http://localhost:8080/admin/niveau", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`, // Add Bearer token
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch grades");
        }

        const result = await response.json();

        // Extract unique grade names
        const uniqueGrades:string[] = Array.from(
          new Set(result.data.map((niveau: any) => niveau.name))
        );

        setGrades(uniqueGrades);
        if (uniqueGrades.length > 0) {
          onGradeChange(uniqueGrades[0]);
        }
      } catch (err) {
        console.error("Error fetching grades:", err);
        setError("Failed to load grades. Please try again.");
      }
    };

    fetchGrades();
  }, []);

  // Add event to the list and make a POST request
  const handleAddEvent = async (newEvent: CalendarEvent) => {
    // Convert Date to Local YYYY-MM-DD HH:mm format
    const formatDate = (date: Date): string => {
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Adjust to local timezone
      return localDate.toISOString().slice(0, 16).replace("T", " ");
    };
  
    // Create the DTO object
    const createExamDTO = {
      subject: newEvent.title,
      startDate: formatDate(newEvent.start),
      endDate: formatDate(newEvent.end),
      duration: newEvent.duration,
      period: selectedPeriodTitle,
      academicYear: selectedYear,
      niveauName: selectedGrade,
      niveauTd: selectedTD === "TD1" ? 1 : 2,
    };
  
    console.log("createExamDTO", createExamDTO);
  
    try {
      // Get JWT Token from local storage
      const jwtToken = localStorage.getItem("jwtToken");
      if (!jwtToken) {
        console.log("No authentication token found");
        throw new Error("No authentication token found");
      }
  
      // Make the POST request
      const response = await fetch("http://localhost:8080/admin/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(createExamDTO),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create event");
      }
  
      const responseData = await response.json();
  
      // Extract the new event data from the response
      console.log("Created event:", responseData.data);
      const createdEvent = {
        id: responseData.data.id,
        title: responseData.data.subject,
        start: new Date(responseData.data.startDate),
        end: new Date(responseData.data.endDate),
        duration: responseData.data.duration,
      };
  
      // Update the events state with the new event
      onEventsChange([...events, createdEvent]);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };
  
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-6 ">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-end gap-4">
              <div className="space-y-2">
                <Label>Period Type</Label>
                <Select
                  value={selectedPeriodTitle}
                  onValueChange={onPeriodTitleChange}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select period type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TITLE_OPTIONS.map((title) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Academic Year</Label>
                <Select value={selectedYear} onValueChange={onYearChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_OPTIONS.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-end gap-4">
              <div className="space-y-2">
                <Label>Grade</Label>
                <Select value={selectedGrade} onValueChange={onGradeChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>TD</Label>
                <Select value={selectedTD} onValueChange={onSelectedTDChange}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Select TD" />
                  </SelectTrigger>
                  <SelectContent>
                    {TD_OPTIONS.map((td) => (
                      <SelectItem key={td} value={td}>
                        {td}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <AddEventDialog
                eventTitles={eventTitles}
                events={events}
                onAddEvent={handleAddEvent}
                selectedGrade={selectedGrade}
                startPeriod={selectedPeriod?.startPeriod}
                endPeriod={selectedPeriod?.endPeriod}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <EventCarousel
        events={events}
        titles={eventTitles}
        isLoading={isLoading}
      />

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
