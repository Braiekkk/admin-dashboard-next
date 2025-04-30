export interface Student {
  /*niveauId: any;*/
  id: number
  name: string
  email: string
  grade: string
  /*idNiveau: number;*/
}

export interface Teacher {
  id: number
  name: string
  email: string
  department: string
}

export interface Exam {
  exam: any
  period: any
  //room_id: number
  room_id: any
  id: number
  subject: string
  date: string
  duration: number
  room : string
  supervisors : Teacher[]
  niveau_id: any
  niveau : string
}

export interface Department {
  id:number
  name: string
  teachers : Teacher[]
}

export interface Niveau {
  id: number;
  name: string;
  students : Student[]
}

export interface Room {
  id: number;
  name: string;
  capacity: number;
  location: string;
  exams?: Exam[];
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

export interface Assignment {
  id: string
  examId: string
  supervisorId: string
  status: "assigned" | "pending" | "confirmed"
  notified: boolean
}