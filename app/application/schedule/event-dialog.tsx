"use client";
import { motion } from "framer-motion";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Period, CalendarEvent } from "@/app/interfaces";

interface EventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  period?: Period;
  events: CalendarEvent[];
  onClose: () => void;
  onDelete: (event: CalendarEvent) => void;
  onUpdate: (event: CalendarEvent) => void;
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

// Calculate duration in minutes between two dates
const calculateDuration = (start: Date, end: Date) => {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
};

// Format time to HH:mm
const formatTimeForSelect = (date: Date) => {
  return format(date, "HH:mm");
};

export function EventDialog({
  event,
  isOpen,
  events,
  period,
  onClose,
  onDelete,
  onUpdate,
}: EventDialogProps) {
  const timeOptions = generateTimeOptions();
  const durationOptions = generateDurationOptions();

  // Initialize state with event values or defaults
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    event ? event.start : undefined
  );
  const [startTime, setStartTime] = React.useState(
    event ? formatTimeForSelect(event.start) : "08:00"
  );
  const [duration, setDuration] = React.useState(() => {
    if (event) {
      const durationInMinutes = calculateDuration(event.start, event.end);
      return durationInMinutes.toString();
    }
    return "60"; // Default duration
  });
  const [error, setError] = React.useState<string>("");

  // Update form values when event changes
  React.useEffect(() => {
    if (event) {
      setSelectedDate(event.start);
      setStartTime(formatTimeForSelect(event.start));
      setDuration(calculateDuration(event.start, event.end).toString());
    }
  }, [event]);

  React.useEffect(() => {
    if (isOpen) {
      setError(""); // ✅ Clear error when the dialog opens
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    setError("");
    e.preventDefault();
    if (!event || !selectedDate) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;

    if (!title) {
      setError("Please enter a title");
      return;
    }

    // Parse the start time
    const [hours, minutes] = startTime.split(":").map(Number);

    // Create new start date by combining selected date with time
    const newStart = new Date(selectedDate);
    newStart.setHours(hours, minutes, 0, 0);

    // Calculate the end time based on duration
    const durationMinutes = Number.parseInt(duration);
    const newEnd = new Date(newStart.getTime() + durationMinutes * 60000);

    // Validate times
    if (newEnd <= newStart) {
      setError("End time must be after start time");
      return;
    }

    // Check if the event is within allowed hours (8 AM to 6 PM)
    if (
      newStart.getHours() < 8 ||
      newEnd.getHours() > 18 ||
      (newEnd.getHours() === 18 && newEnd.getMinutes() > 0)
    ) {
      setError("Events must be scheduled between 8 AM and 6 PM");
      return;
    }

    // Check if the event is after the selectedDate prop
    if (period && newStart < period.startPeriod!) {
      setError("Event must be after the selected date");
      return;
    }

    // Check if the event is before the endPeriod prop
    if (period && newEnd > period.endPeriod) {
      setError("Event must end before the end period");
      return;
    }
    events = events.filter((e) => e.id !== event.id);
    // Check if there are more than 3 events on the same day
    const eventsOnSameDay = events.filter((event) => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === newStart.toDateString();
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
        (newStart >= eventStart && newStart < eventEnd) ||
        (newEnd > eventStart && newEnd <= eventEnd) ||
        (newStart <= eventStart && newEnd >= eventEnd)
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
        (newStart >= eventEnd &&
          newStart.getTime() - eventEnd.getTime() < 30 * 60000) ||
        (newEnd <= eventStart &&
          eventStart.getTime() - newEnd.getTime() < 30 * 60000)
      ) {
        setError("There must be at least a 30-minute break between events");
        return;
      }
    }

    const updatedEvent: CalendarEvent = {
      ...event,
      title,
      start: newStart,
      end: newEnd,
      duration: durationMinutes,
    };

    console.log("updatedEvent", updatedEvent);

    onUpdate(updatedEvent);
    onClose();
  };

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Make changes to your event here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={event.title}
                placeholder="Enter event title"
              />
            </div>
            <div className="grid gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`justify-start text-left font-normal ${
                      !selectedDate && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    month={selectedDate}
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
            {error && (
              <motion.div
                key={error} // 👈 This forces re-animation whenever the error changes
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="text-sm text-destructive"
              >
                {error}
              </motion.div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onDelete(event);
                onClose();
              }}
            >
              Delete Event
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
