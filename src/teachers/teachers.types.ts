import { IsEmail, IsNotEmpty, IsObject, IsPhoneNumber, IsString } from "class-validator";
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

export class CreateTeacherDTO {
  @IsString()
  @IsNotEmpty()
  public nume: string;

  @IsString()
  public experienta: string;

  @IsString()
  public descriere: string;

  @IsString()
  @IsEmail()
  public email: string;

  @IsString()
  @IsPhoneNumber('RO')
  public telefon: string;

  public imagine: TeacherImage;
  public createdBy?: any;
  public createdAt?: Date;
}