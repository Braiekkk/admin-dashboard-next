export interface Student {
  id: number
  name: string
  email: string
  grade: string
}

export interface Teacher {
  id: number
  name: string
  email: string
  department: string
}

export interface Exam {
  id: number
  subject: string
  date: string
  duration: number
}

export interface Department {
  id:number
  name: string
  description: string
  teachers : Teacher[]
}

export interface Niveau {
  id: string;
  name: string;
}

export interface Period {
  id: string
  title: "DS_S1" | "Examen_S1" | "DS_S2" | "Examen_S2" | "Control_S1" | "Control_S2"
  year: string
  startPeriod: Date
  endPeriod: Date
}

export interface CalendarEvent {
  id?: number
  title: string
  start: Date
  end: Date
  resourceId?: number
  duration?: number
}