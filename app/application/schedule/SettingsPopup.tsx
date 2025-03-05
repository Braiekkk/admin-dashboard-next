"use client";

import * as React from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Period } from "@/app/interfaces";

interface SettingsPopupProps {
  periods: Period[];
  onPeriodsChange: (periods: Period[]) => void;
}

const TITLE_OPTIONS = [
  "DS_S1",
  "Examen_S1",
  "DS_S2",
  "Examen_S2"
] as const;
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => {
  const year = CURRENT_YEAR - 2 + i;
  return `${year}-${year + 1}`;
});

export function SettingsPopup({
  periods,
  onPeriodsChange,
}: SettingsPopupProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState<string>(
    YEAR_OPTIONS[1]
  ); // Current year by default
  const [newPeriod, setNewPeriod] = React.useState<Partial<Period>>({
    year: selectedYear,
  });
  const [error, setError] = React.useState<string>("");

  // Filter periods by selected year
  const filteredPeriods = periods.filter(
    (period) => period.year === selectedYear
  );

  const validatePeriod = () => {
    if (
      !newPeriod.title ||
      !newPeriod.year ||
      !newPeriod.startPeriod ||
      !newPeriod.endPeriod
    ) {
      throw new Error("Please fill in all fields");
    }

    if (newPeriod.endPeriod <= newPeriod.startPeriod) {
      throw new Error("Invalid dates: End date must be after start date");
    }

    const periodId = `${newPeriod.title}_${newPeriod.year}`;
    const periodExists = periods.some((p) => p.id === periodId);
    if (periodExists) {
      throw new Error("Period already set up for this academic year");
    }
  };

  const handleAddPeriod = () => {
    try {
      validatePeriod();

      const newPeriodWithId = {
        ...(newPeriod as Period),
        id: `${newPeriod.title}_${newPeriod.year}`,
      };

      onPeriodsChange([...periods, newPeriodWithId]);
      setNewPeriod({ year: selectedYear }); // Reset form but keep selected year
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDeletePeriod = (id: string) => {
    onPeriodsChange(periods.filter((period) => period.id !== id));
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setNewPeriod((prev) => ({ ...prev, year }));
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 right-4"
        onClick={() => setOpen(true)}
      >
        <Settings className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule Settings</DialogTitle>
            <DialogDescription>
              Manage your academic periods and their schedules.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6">
            {/* Single Academic Year Selector */}

            <div className="grid grid-rows-[auto,1fr] gap-6 h-[600px]">
              {/* Add New Period Form */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Select
                        value={newPeriod.title}
                        onValueChange={(value: Period["title"]) =>
                          setNewPeriod((prev) => ({ ...prev, title: value }))
                        }
                      >
                        <SelectTrigger>
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
                      <Select
                        value={selectedYear}
                        onValueChange={handleYearChange}
                      >
                        <SelectTrigger>
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
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${
                              !newPeriod.startPeriod && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newPeriod.startPeriod
                              ? format(newPeriod.startPeriod, "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={newPeriod.startPeriod}
                            onSelect={(date) =>
                              setNewPeriod((prev) => ({
                                ...prev,
                                startPeriod: date ?? undefined,
                              }))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${
                              !newPeriod.endPeriod && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newPeriod.endPeriod
                              ? format(newPeriod.endPeriod, "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={newPeriod.endPeriod}
                            onSelect={(date) =>
                              setNewPeriod((prev) => ({
                                ...prev,
                                endPeriod: date ?? undefined,
                              }))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-destructive mt-2">{error}</p>
                  )}

                  <Button className="w-full mt-4" onClick={handleAddPeriod}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Period
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Periods List */}
              <div className="space-y-2 min-h-0">
                <h4 className="font-medium">
                  Existing Periods for {selectedYear}
                </h4>
                <ScrollArea className="h-[calc(100%-2rem)] rounded-md border">
                  <div className="p-4 space-y-4">
                    {filteredPeriods.map((period) => (
                      <Card key={period.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="grid gap-1">
                              <div className="font-medium">{period.title}</div>
                              <div className="text-sm">
                                {format(period.startPeriod, "PPP")} -{" "}
                                {format(period.endPeriod, "PPP")}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDeletePeriod(period.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {filteredPeriods.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No periods added for {selectedYear}
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
