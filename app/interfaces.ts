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
  id: number
  subject: string
  date: string
  duration: number
  room : string
  supervisors : Teacher[]
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
