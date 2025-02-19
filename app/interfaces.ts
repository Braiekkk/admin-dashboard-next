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
