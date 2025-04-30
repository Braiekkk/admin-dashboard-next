"use client"
import { useState, useEffect } from "react";
import BigCalender from "./BigCalender";
import { SettingsPopup } from "./SettingsPopup";
import { CalendarDetails } from "./calendar-details";
import { CalendarEvent, Period } from "@/app/interfaces";

const DUMMY_PERIODS: Period[] = [
  {
    id: "DS_S1_2024-2025",
    title: "DS_S1",
    year: "2024-2025",
    startPeriod: new Date(2024, 10, 17), // November 17, 2024
    endPeriod: new Date(2024, 10, 23), // November 23, 2024
  },
  {
    id: "Examen_S1_2024-2025",
    title: "Examen_S1",
    year: "2024-2025",
    startPeriod: new Date(2025, 0, 3), // January 3, 2025
    endPeriod: new Date(2025, 0, 15), // January 15, 2025
  },
  {
    id: "DS_S2_2024-2025",
    title: "DS_S2",
    year: "2024-2025",
    startPeriod: new Date(2025, 2, 17), // March 17, 2024
    endPeriod: new Date(2025, 2, 23), // March 23, 2024
  },
];

const Page = () => {
  const [periods, setPeriods] = useState<Period[]>(DUMMY_PERIODS);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [eventTitles, setEventTitles] = useState<string[]>([]);
  const [selectedPeriodTitle, setSelectedPeriodTitle] = useState<string>("DS_S2");
  const [selectedTD, setSelectedTD] = useState<string>("TD1");
  const [selectedYear, setSelectedYear] = useState<string>("2024-2025");
  const [selectedGrade, setSelectedGrade] = useState<string>("");

  // Fetch events from the API on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8080/admin/exams");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data); // Assuming the API returns an array of events
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []); // Empty dependency array ensures this effect runs once after the component mounts

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
      <SettingsPopup periods={periods} onPeriodsChange={setPeriods} />
      <CalendarDetails
        eventTitles={eventTitles}
        periods={periods}
        events={events}
        selectedPeriodTitle={selectedPeriodTitle}
        selectedYear={selectedYear}
        selectedGrade={selectedGrade}
        selectedTD={selectedTD}
        onSelectedTDChange={setSelectedTD}
        onEventTitlesChange={setEventTitles}
        onPeriodTitleChange={setSelectedPeriodTitle}
        onYearChange={setSelectedYear}
        onGradeChange={setSelectedGrade}
        onEventsChange={setEvents}
      />
      <BigCalender
        periods={periods}
        events={events}
        selectedPeriodTitle={selectedPeriodTitle}
        selectedYear={selectedYear}
        onEventsChange={setEvents}
      />
    </div>
  );
};

export default Page;
