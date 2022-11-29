import { IsNotEmpty, IsString } from "class-validator";

export class SettingsDTO {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    summary: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    currency: string;

    company: {
        name: string;
        description: string;
        cui: string;
        j: string;
    };

    contact: {
        address: string;
        phones: {
            type: string;
            number: string;
            person: string;
        }[];
        email: string;
        web: string;
    }

    social: {
        facebook: string;
        twitter: string;
        instagram: string;
        linkedin: string;
        youtube: string;
    }

    meta: {
        title: string;
        description: string;
        keywords: string;
        author: string;
        robots: string;
    };

    public createdBy?: any;
    public createdAt?: Date;
}