"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  momentLocalizer,
  type View,
  Views,
  type CalendarProps,
  type NavigateAction,
} from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { EventDialog } from "./event-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Period, CalendarEvent } from "@/app/interfaces"

interface BigCalendarProps {
  periods: Period[]
  events: CalendarEvent[]
  selectedPeriodTitle: string
  selectedYear: string
  onEventsChange: (events: CalendarEvent[]) => void
}

const BigCalender = ({ periods, events, selectedPeriodTitle, selectedYear, onEventsChange }: BigCalendarProps) => {
  const [currentDate, setCurrentDate] = useState<Date>()
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [selectedPeriod , setSelectedPeriod] = useState<Period>();

  // Update calendar when period selection changes
  useEffect(() => {
    if (selectedPeriodTitle && selectedYear) {
      const selectedPeriod = periods.find(
        (period) => period.title === selectedPeriodTitle && period.year === selectedYear,
      )

      if (selectedPeriod) {
        setCurrentDate(selectedPeriod.startPeriod)
        setErrorMessage("")
      } else {
        setErrorMessage("Please set up the appropriate period information in the settings above")
      }
    }
  }, [selectedPeriodTitle, selectedYear, periods])
  // Update selected period when period selection changes
  useEffect(() => {

    const period = periods.find(
      (period) =>
        period.title === selectedPeriodTitle && period.year === selectedYear
    );
    setSelectedPeriod(period);
    
   },[selectedPeriodTitle, selectedYear])
  
  const localizer = momentLocalizer(moment)

  const handleNavigate = (newDate: Date, view: View, action: NavigateAction) => {
    setCurrentDate(newDate)
  }

  const handleDoubleClickEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
  }

  const handleCloseDialog = () => {
    setSelectedEvent(null)
  }

  const handleUpdateEvent = async (updatedEvent: CalendarEvent) => {
    // Convert Date to Local YYYY-MM-DD HH:mm format
    const formatDate = (date: Date): string => {
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Adjust to local timezone
      return localDate.toISOString().slice(0, 16).replace("T", " ");
    };
  
    // Create the DTO object
    const updateExamDTO = {
      subject: updatedEvent.title,
      startDate: formatDate(updatedEvent.start),
      endDate: formatDate(updatedEvent.end),
      duration: updatedEvent.duration,
    };
  
    console.log("Update DTO:", updateExamDTO);
  
    try {
      // Get JWT Token from local storage
      const jwtToken = localStorage.getItem("jwtToken");
      if (!jwtToken) {
        console.log("No authentication token found");
        throw new Error("No authentication token found");
      }
  
      // Make the PUT request
      const response = await fetch(`http://localhost:8080/admin/exams/${updatedEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(updateExamDTO),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update event");
      }
  
      const responseData = await response.json();
  
      // Extract the updated event data from the response
      console.log("Updated event:", responseData.data);
      const updatedEventData = {
        id: responseData.data.id,
        title: responseData.data.subject,
        start: new Date(responseData.data.startDate),
        end: new Date(responseData.data.endDate),
        duration: responseData.data.duration,
      };
  
      // Update the events state with the updated event
      onEventsChange(events.map((event) => (event.id === updatedEventData.id ? updatedEventData : event)));
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

const handleDeleteEvent = async (eventToDelete: CalendarEvent) => {
  try {
    // Get JWT Token from local storage
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      console.error("No authentication token found");
      throw new Error("No authentication token found");
    }

    // Make the DELETE request
    const response = await fetch(`http://localhost:8080/admin/exams/${eventToDelete.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete event");
    }

    console.log("Event deleted:", eventToDelete.id);

    // Update the events state by removing the deleted event
    onEventsChange(events.filter((event) => event.id !== eventToDelete.id));
  } catch (error) {
    console.error("Error deleting event:", error);
  }
};

  const eventStyleGetter = (event: CalendarEvent) => ({
    style: {
      backgroundColor: "#e3f7ff",
      color: "#1e293b",
      border: "none",
      borderRadius: "6px",
      padding: "4px 8px",
      fontSize: "14px",
      fontWeight: 500,
    },
  })

  const calendarProps: Partial<CalendarProps<CalendarEvent, object>> = {
    localizer,
    events,
    startAccessor: "start",
    endAccessor: "end",
    step: 60,
    timeslots: 1,
    defaultView: Views.WEEK,
    views: [Views.WEEK],
    date: currentDate,
    onNavigate: handleNavigate,
    onDoubleClickEvent: handleDoubleClickEvent,
    min: new Date(2024, 0, 1, 8, 0),
    max: new Date(2024, 0, 1, 18, 0),
    eventPropGetter: eventStyleGetter,
    toolbar: true,
    rtl: false,
    allDaySlot: false,
    showMultiDayTimes: true,
    length: 6,
    daysOfWeek: [1, 2, 3, 4, 5, 6],
    formats: {
      weekdayFormat: (date: Date, culture?: string, localizer?: any) => localizer.format(date, "dddd", culture),
    },
  }

  return (
    <div className="h-screen p-4 bg-[#f8f9fc]">
      <div className="h-full rounded-lg shadow-lg bg-white p-6">
        {errorMessage ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : (
          <Calendar<CalendarEvent, object>
            {...calendarProps}
            className="rounded-lg"
            style={{ height: "calc(100vh - 12rem)" }}
          />
        )}

        <EventDialog
          event={selectedEvent}
          period={selectedPeriod}
          isOpen={!!selectedEvent}
          events={events}
          onClose={handleCloseDialog}
          onDelete={handleDeleteEvent}
          onUpdate={handleUpdateEvent}
        />
      </div>
    </div>
  )
}

export default BigCalender

