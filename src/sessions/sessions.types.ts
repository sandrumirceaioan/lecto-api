import { IsNotEmpty, IsString } from "class-validator";
import { Session, SessionCourse } from "./sessions.schema";

export type SessionType = "online" | "local";

export interface SessionsPaginated {
  sessions: Session[];
  total: number;
}

export interface SessionCertification {
  anc?: boolean;
  participare?: boolean;
}

export interface SessionPrices {
  anc?: number;
  participare?: number;
}


export class SessionCreateDTO {
  @IsNotEmpty()
  @IsString()
  titlu: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  type: SessionType;

  @IsNotEmpty()
  status: any;

  @IsString()
  descriere: string;

  @IsNotEmpty()
  inscriere: any;

  @IsNotEmpty()
  perioada: any;

  @IsNotEmpty()
  cursuri: SessionCourse[];

  @IsNotEmpty()
  locatie: Location[];

  public createdBy?: any;
  public createdAt?: Date;
}