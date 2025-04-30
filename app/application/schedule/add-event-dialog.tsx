"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarEvent } from "@/app/interfaces";

interface AddEventDialogProps {
  eventTitles: string[];
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  selectedGrade: string;
  startPeriod?: Date;
  endPeriod?: Date;
}

// Generate time options for the select (30-minute intervals)
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 8; hour <= 18; hour++) {
    for (const minute of [0, 30]) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      options.push(time);
    }
  }
  return options;
};

// Generate duration options (30-minute intervals up to 4 hours)
const generateDurationOptions = () => {
  const options = [];
  for (let minutes = 30; minutes <= 240; minutes += 30) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const label =
      hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}m` : ""}` : `${mins}m`;
    options.push({ value: minutes.toString(), label });
  }
  return options;
};

export function AddEventDialog({
  eventTitles,
  events,
  onAddEvent,
  selectedGrade,
  startPeriod,
  endPeriod,
}: AddEventDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [startTime, setStartTime] = React.useState("08:00");
  const [duration, setDuration] = React.useState("60");
  const [error, setError] = React.useState<string>("");
  const [date, setDate] = React.useState<Date>();
  const [selectedTitle, setSelectedTitle] = React.useState<string>("");

  const timeOptions = generateTimeOptions();
  const durationOptions = generateDurationOptions();

  React.useEffect(() => {
    if (startPeriod) {
      setDate(startPeriod);
    }
  }, [startPeriod]);

  React.useEffect(() => {
    if (!open) {
      setError(""); // Reset error messages when dialog closes
    }
  }, [open]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTitle) {
      setError("Please enter a title");
      return;
    }

    if (!date) {
      setError("Please select a date");
      return;
    }

    // Parse the start time
    const [hours, minutes] = startTime.split(":").map(Number);
    const start = new Date(date);
    start.setHours(hours, minutes, 0, 0);

    // Calculate the end time based on duration
    const durationMinutes = Number.parseInt(duration);
    const end = new Date(start.getTime() + durationMinutes * 60000);

    // Check if the event is within allowed hours (8 AM to 6 PM)
    if (
      end.getHours() > 18 ||
      (end.getHours() === 18 && end.getMinutes() > 0)
    ) {
      setError("Events must end before 6 PM");
      return;
    }

    // Check if the event is after the selectedDate prop
    if (start < startPeriod!) {
      setError("Event must be after the period start date");
      return;
    }

    // Check if the event is before the endPeriod prop
    if (end > endPeriod!) {
      setError("Event must end before the period end period");
      return;
    }

    // Check if there are more than 3 events on the same day
    const eventsOnSameDay = events.filter((event) => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === start.toDateString();
    });
    if (eventsOnSameDay.length >= 3) {
      setError("There cannot be more than 3 events per day");
      return;
    }

    // Check if the event intertwines with other events
    for (const event of events) {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      if (
        (start >= eventStart && start < eventEnd) ||
        (end > eventStart && end <= eventEnd) ||
        (start <= eventStart && end >= eventEnd)
      ) {
        setError("Event times cannot overlap with existing events");
        return;
      }
    }

    // Check if there is at least a 30-minute break between events
    for (const event of events) {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      if (
        (start >= eventEnd &&
          start.getTime() - eventEnd.getTime() < 30 * 60000) ||
        (end <= eventStart && eventStart.getTime() - end.getTime() < 30 * 60000)
      ) {
        setError("There must be at least a 30-minute break between events");
        return;
      }
    }

    const newEvent: CalendarEvent = {
      title: selectedTitle,
      start,
      end,
      duration: durationMinutes,
      resourceId: undefined, // Add resourceId if needed
    };
    onAddEvent(newEvent);
    setError("");
    setOpen(false);
  };

  // Filter event titles to exclude those already present in events
  const availableEventTitles = eventTitles.filter(
    (title) => !events.some((event) => event.title === title)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new Exam for {selectedGrade}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Select value={selectedTitle} onValueChange={setSelectedTitle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event title" />
                </SelectTrigger>
                <SelectContent>
                  {availableEventTitles.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !date && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    month={date}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {format(parse(time, "HH:mm", new Date()), "h:mm a")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && <div className="text-sm text-destructive">{error}</div>}
          </div>
          <DialogFooter>
            <Button type="submit">Add Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 