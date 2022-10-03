import { IsNotEmpty, IsString } from "class-validator";
import { Teacher } from "./teachers.schema";

export interface TeacherImage {
    name: string;
    file: any;
    small?: string;
    original?: string;
  }
  

export interface TeachersPaginated {
    teachers: Teacher[];
    total: number;
}