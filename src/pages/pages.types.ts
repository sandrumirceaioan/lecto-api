import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { Page } from "./pages.schema";

export interface PageImage {
  name: string;
  file: any;
  small?: string;
  original?: string;
}

export interface PagesPaginated {
  pages: Page[];
  total: number;
}

export class CreatePageDTO {
  @IsString()
  @IsNotEmpty()
  public titlu: string;

  @IsString()
  @IsNotEmpty()
  public url: string;

  public imagine: PageImage;

  @IsString()
  public descriere: string;

  @IsNotEmpty()
  public status: any;

  public createdBy?: any;
  public createdAt?: Date;
}