import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
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

export interface Localitate {
    nume?: string;
    simplu?: string;
  }
  export interface LocationGroup {
    nume: string;
    localitati: { nume?: string; simplu?: string; }[];
  }

  export interface LocationsPaginated {
    locations: Location[];
    total: number;
}