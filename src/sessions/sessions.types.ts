import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { Course } from "./sessions.schema";

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

export class CreateCourseDTO {
  @IsString()
  @IsNotEmpty()
  public titlu: string;

  @IsString()
  @IsNotEmpty()
  public url: string;

  @IsString()
  public descriere: string;

  public certificare: CourseCertification;
  public pret: CoursePrices;

  @IsNotEmpty()
  public status: any;

  public imagine: CourseImage;
  public createdBy?: any;
  public createdAt?: Date;
}