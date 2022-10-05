import { IsNotEmpty, IsString } from "class-validator";
import { Course } from "./courses.schema";

export interface CourseImage {
    name: string;
    file: any;
    small?: string;
    original?: string;
  }
  

export interface CoursesPaginated {
    courses: Course[];
    total: number;
}

export interface CourseCertification {
  anc?: boolean;
  participare?: boolean;
}

export interface CoursePrices {
  anc?: number;
  participare?: number;
}