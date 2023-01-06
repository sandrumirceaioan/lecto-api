import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, SetMetadata, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OneFileInterceptor } from '../common/interceptors/file.interceptor';
import { WebpInterceptor } from '../common/interceptors/webp-converter.interceptor';
import { GetCurrentUserId } from '../common/decorators/current-user-id.decorator';
import { SharedService } from '../common/modules/shared/shared.service';
import { SessionsService } from './sessions.service';
import { SessionCreateDTO, SessionsPaginated } from './sessions.types';
import { SessionCourse } from './sessions.schema';

@SetMetadata('roles', 'admin')
@Controller('sessions')
export class SessionsController {

    constructor(
        private sessionsService: SessionsService,
        private sharedService: SharedService
    ) { }

    // GET SESSIONS
    @HttpCode(HttpStatus.OK)
    @Get('/paginated')
    async getPaginatedSessions(@Query() params): Promise<SessionsPaginated> {
        let { skip, limit, sort, direction, search } = params;

        let query: any = {};

        if (search) {
            query = Object.assign(query, {
                $or: [
                    { titlu: new RegExp(search, 'i') },
                    { url: new RegExp(search, 'i') },
                    { descriere: new RegExp(search, 'i') },
                ],
            });
        }

        let options: any = {
            skip: skip ? parseInt(skip) : 0,
            limit: limit ? parseInt(limit) : 10,
        };

        if (sort && direction) {
            if (sort === 'pret') sort = 'pret.anc';
            options = Object.assign(options, {
                sort: {
                    [sort]: direction === 'asc' ? 1 : -1
                }
            });
        };

        let [sessions, total] = await Promise.all([
            this.sessionsService.find(query, options),
            this.sessionsService.count(query)
        ]);

        return { sessions, total };
    }

    // GET ALL SESSIONS
    @HttpCode(HttpStatus.OK)
    @Get('/')
    async getSessions() {
        return await this.sessionsService.find({});
    }

    // GET ONE COURSE
    @HttpCode(HttpStatus.OK)
    @Get('/:id')
    async getSession(
        @Param('id') id: string,
    ) {
        return await this.sessionsService.findById(id);
    }

    // CREATE SESSION
    @HttpCode(HttpStatus.OK)
    @Post('/create')
    async createSession(
        @Body() body: SessionCreateDTO,
        @GetCurrentUserId() userId: string,
    ) {
        let session = {
            ...body,
            cursuri: body.cursuri.map((curs: any) => {
                let cleaned = {
                    ...curs,
                    data: this.sharedService.toObjectId(curs.data._id),
                    teachers: curs.teachers.map(teacher => this.sharedService.toObjectId(teacher._id)),
                };

                delete cleaned.selectTeacher;
                delete cleaned.toggleTeachers;
                delete cleaned.toggleOptions;
                delete cleaned.toggleDiscounts;

                return cleaned;
            })
        }

        // if (body.locatie && body.locatie.data) {
        //     session.locatie = {
        //         ...body.locatie,
        //         data: this.sharedService.toObjectId(body.locatie.data._id),
        //     };
        // }

        if (body.descriere && body.descriere.indexOf('<p data-f-id')) {
            body.descriere = body.descriere.split('<p data-f-id')[0];
        }

        return await this.sessionsService.save({ ...session, createdBy: userId });
    }

    // UPDATE SESSION
    @HttpCode(HttpStatus.OK)
    @Put('/:id')
    async updateSession(
        @Param('id') id: string,
        @Body() body: SessionCreateDTO,
        @GetCurrentUserId() userId: string,
    ) {

        let session = {
            ...body,
            cursuri: body.cursuri.map((curs: any) => {
                let cleaned = {
                    ...curs,
                    data: this.sharedService.toObjectId(curs.data._id),
                    teachers: curs.teachers.map(teacher => this.sharedService.toObjectId(teacher._id)),
                };

                delete cleaned.selectTeacher;
                delete cleaned.toggleTeachers;
                delete cleaned.toggleOptions;
                delete cleaned.toggleDiscounts;

                return cleaned;
            })
        }

        // if (body.locatie && body.locatie.data) {
        //     session.locatie = {
        //         ...body.locatie,
        //         data: this.sharedService.toObjectId(body.locatie.data._id),
        //     };
        // }

        if (body.descriere && body.descriere.indexOf('<p data-f-id')) {
            body.descriere = body.descriere.split('<p data-f-id')[0];
        }

        return await this.sessionsService.findByIdAndUpdate(id, { ...session, createdBy: userId });
    }

    // UPLOAD SESSION IMAGES
    @UseInterceptors(
        OneFileInterceptor('file', 'assets/sesiuni'),
        WebpInterceptor('assets/public/sesiuni', 100),
    )
    @HttpCode(HttpStatus.OK)
    @Post('/content-image-upload')
    async uploadSessionImages(
        @UploadedFile() file: Express.Multer.File,
    ): Promise<any> {
        return {
            link: `${this.sharedService.appUrl}/sesiuni/${file['originalname'].split('.')[0]}.webp`,
        };
    }

    // DELETE SESSION
    @HttpCode(HttpStatus.OK)
    @Delete('/:id')
    async deleteSession(@Param('id') id: string) {
        return await this.sessionsService.remove(id);
    }
}
