import { IsNotEmpty, IsString } from "class-validator";
import { Resort } from "./resorts.schema";

export interface GalleryImage {
  name: string;
  file: any;
  small?: string;
  original?: string;
  main?: boolean;
}

export interface Localitate {
  nume?: string;
  simplu?: string;
}
export interface LocationGroup {
  nume: string;
  localitati: { nume?: string; simplu?: string; }[];
}

export interface ResortsPaginated {
  resorts: Resort[];
  total: number;
}

export class CreateResortDTO {
  @IsString()
  @IsNotEmpty()
  public resort: string;

  @IsString()
  @IsNotEmpty()
  public url: string;

  @IsString()
  @IsNotEmpty()
  public descriere: string;

  @IsString()
  @IsNotEmpty()
  public oras: string;

  @IsString()
  @IsNotEmpty()
  public judet: string;

  @IsNotEmpty()
  public status: any;

  public imagine: GalleryImage;
  public createdBy?: any;
  public createdAt?: Date;
}