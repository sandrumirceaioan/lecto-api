import { IsNotEmpty, IsString } from "class-validator";
import { Location } from "./locations.schema";

export interface OfertaLocatie {
    nume: string; // 6 nopti demipensiune, 7 nopti demipensiune, 6 nopti pensiune completa, 7 nopti pensiune completa
    pret: number; // 4090
    statis: boolean;
}

export interface GalleryImage {
  name: string;
  file: any;
  small?: string;
  original?: string;
  main?: boolean;
}

  export interface LocationsPaginated {
    locations: Location[];
    total: number;
}

export class CreateLocationDTO {
  @IsString()
  @IsNotEmpty()
  public locatie: string;

  @IsString()
  @IsNotEmpty()
  public url: string;

  @IsString()
  @IsNotEmpty()
  public descriere: string;

  @IsNotEmpty()
  public resort: any;

  @IsNotEmpty()
  public status: any;

  public imagine: GalleryImage;
  public galerie: GalleryImage[];
  public createdBy?: any;
  public createdAt?: Date;
}