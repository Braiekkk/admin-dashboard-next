"use client";

import { FC, useMemo, useState } from "react";
import {
  Calendar,
  momentLocalizer,
  View,
  Views,
  CalendarProps,
  NavigateAction,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";



interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resourceId?: number;
}

const BigCalender: FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const localizer = momentLocalizer(moment);
  
  const handleNavigate = (
    newDate: Date,
    view: View,
    action: NavigateAction
  ) => {
    setCurrentDate(newDate);
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
  });

  // Define static scheduled events for Monday to Saturday
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monday = today.getDate() - today.getDay() + 1; // Get Monday of the current week

  const calendarEvents = [
    // Monday
    {
      title: "Math",
      allDay: false,
      start: new Date(year, month, monday, 8, 0),
      end: new Date(year, month, monday, 16, 30),
    },

    // Wednesday
    {
      title: "Geography",
      allDay: false,
      start: new Date(year, month, monday + 2, 8, 0),
      end: new Date(year, month, monday + 2, 8, 45),
    },
    {
      title: "Physics",
      allDay: false,
      start: new Date(year, month, monday + 2, 9, 0),
      end: new Date(year, month, monday + 2, 9, 45),
    },

    // Thursday
    {
      title: "Math",
      allDay: false,
      start: new Date(year, month, monday + 3, 8, 0),
      end: new Date(year, month, monday + 3, 8, 45),
    },
    {
      title: "English",
      allDay: false,
      start: new Date(year, month, monday + 3, 9, 0),
      end: new Date(year, month, monday + 3, 9, 45),
    },

    // Friday
    {
      title: "History",
      allDay: false,
      start: new Date(year, month, monday + 4, 10, 0),
      end: new Date(year, month, monday + 4, 10, 45),
    },
    {
      title: "Chemistry",
      allDay: false,
      start: new Date(year, month, monday + 4, 13, 0),
      end: new Date(year, month, monday + 4, 13, 45),
    },

    // Saturday
    {
      title: "English",
      allDay: false,
      start: new Date(year, month, monday + 5, 8, 0),
      end: new Date(year, month, monday + 5, 8, 45),
    },
    {
      title: "Biology",
      allDay: false,
      start: new Date(year, month, monday + 5, 9, 0),
      end: new Date(year, month, monday + 5, 9, 45),
    },
  ];
  const calendarProps: Partial<CalendarProps<CalendarEvent, object>> = {
    localizer,
    events: calendarEvents,
    startAccessor: "start",
    endAccessor: "end",
    step: 60,
    timeslots: 1,
    defaultView: Views.WEEK,
    views: [Views.WEEK],
    date: currentDate,
    onNavigate: handleNavigate,
    min: new Date(monday, month, monday, 8, 0),
    max: new Date(monday, month, monday, 18, 0),
    eventPropGetter: eventStyleGetter,
    toolbar: true,
    rtl: false,
    allDaySlot: false,
    showMultiDayTimes: true,
    length: 6,
    daysOfWeek: [1, 2, 3, 4, 5, 6], // ✅ Excludes Sunday (0)
    formats: {
      weekdayFormat: (date: Date, culture?: string, localizer?: any) =>
        localizer.format(date, "dddd", culture), // ✅ Show full weekday names
    },
  };

  const currentWeek = moment(currentDate).format("MMMM D, YYYY");

  return (
    <div className="h-screen p-4 bg-[#f8f9fc]">
      <div className="h-full rounded-lg shadow-lg bg-white p-6">
        <Calendar<CalendarEvent, object>
          {...calendarProps}
          className="rounded-lg"
          style={{ height: "calc(100vh - 8rem)" }}
        />
      </div>
    </div>
  );
};

export default BigCalender;
