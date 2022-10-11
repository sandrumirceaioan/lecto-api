import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, SetMetadata, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OneFileInterceptor } from '../common/interceptors/file.interceptor';
import { WebpInterceptor } from '../common/interceptors/webp-converter.interceptor';
import { GetCurrentUserId } from '../common/decorators/current-user-id.decorator';
import { SharedService } from '../common/modules/shared/shared.service';
import { Course } from './courses.schema';
import { CoursesService } from './courses.service';
import { CourseImage, CoursesPaginated, CreateCourseDTO } from './courses.types';

@SetMetadata('roles', 'admin')
@Controller('courses')
export class CoursesController {

    constructor(
        private coursesService: CoursesService,
        private sharedService: SharedService
    ) { }

    // GET COURSES
    @HttpCode(HttpStatus.OK)
    @Get('/paginated')
    async getPaginatedCourses(@Query() params): Promise<CoursesPaginated> {
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

        let [courses, total] = await Promise.all([
            this.coursesService.find(query, options),
            this.coursesService.count(query)
        ]);

        return { courses, total };
    }

    // GET ALL COURSES
    @HttpCode(HttpStatus.OK)
    @Get('/')
    async getCourses() {
        return await this.coursesService.find({});
    }

    // GET ONE COURSE
    @HttpCode(HttpStatus.OK)
    @Get('/:id')
    async getCourse(
        @Param('id') id: string,
    ) {
        return await this.coursesService.findById(id);
    }

    // CREATE COURSE
    @UseInterceptors(
        OneFileInterceptor('file', 'assets/cursuri'),
        WebpInterceptor('assets/public/cursuri', 150),
    )
    @HttpCode(HttpStatus.OK)
    @Post('/create')
    async createCourse(
        @Body() body: CreateCourseDTO,
        @UploadedFile() file: Express.Multer.File,
        @GetCurrentUserId() userId: string,
    ) {

        body.certificare = JSON.parse(<any>body.certificare);
        body.pret = JSON.parse(<any>body.pret);

        if (file) {
            body.imagine = {
                name: file.originalname,
                file: file,
                small: `${this.sharedService.appUrl}/cursuri/${file.originalname.split('.')[0]}-small.webp`,
                original: `${this.sharedService.appUrl}/cursuri/${file.originalname.split('.')[0]}.webp`
            };
        } else {
            if (body.imagine) {
                body.imagine = JSON.parse(<any>body.imagine);
            } else {
                body.imagine = null;
            }
        }

        return await this.coursesService.save({ ...body, createdBy: userId });
    }

    // UPDATE COURSE
    @UseInterceptors(
        OneFileInterceptor('file', 'assets/cursuri'),
        WebpInterceptor('assets/public/cursuri', 150),
    )
    @HttpCode(HttpStatus.OK)
    @Put('/:id')
    async updateCourse(
        @Param('id') id: string,
        @Body() body: CreateCourseDTO,
        @UploadedFile() file: Express.Multer.File,
        @GetCurrentUserId() userId: string,
    ) {

        body.certificare = JSON.parse(<any>body.certificare);
        body.pret = JSON.parse(<any>body.pret);

        if (file) {
            body.imagine = {
                name: file.originalname,
                file: file,
                small: `${this.sharedService.appUrl}/cursuri/${file.originalname.split('.')[0]}-small.webp`,
                original: `${this.sharedService.appUrl}/cursuri/${file.originalname.split('.')[0]}.webp`
            };
        } else {
            if (body.imagine) {
                body.imagine = JSON.parse(<any>body.imagine);
            } else {
                body.imagine = null;
            }
        }

        return await this.coursesService.findByIdAndUpdate(id, {
            ...body,
            createdBy: userId,
        });
    }

    // UPLOAD LOCATION IMAGES
    @UseInterceptors(
        OneFileInterceptor('file', 'assets/cursuri'),
        WebpInterceptor('assets/public/cursuri', 100),
    )
    @HttpCode(HttpStatus.OK)
    @Post('/content-image-upload')
    async uploadLocationImages(
        @UploadedFile() file: Express.Multer.File,
    ): Promise<any> {
        return {
            link: `${this.sharedService.appUrl}/cursuri/${file['originalname'].split('.')[0]}.webp`,
        };
    }

    // DELETE COURSE
    @HttpCode(HttpStatus.OK)
    @Delete('/:id')
    async deleteCourse(@Param('id') id: string) {
        return await this.coursesService.remove(id);
    }

    // GET COURSES FOR AUTOCOMPLETE
    @HttpCode(HttpStatus.OK)
    @Post('/search')
    async searchCourses(
        @Body() body
    ) {
        let { search } = body;
        if (!search || search === '') return [];

        let query: any = {};

        query = Object.assign(query, {
            $or: [
                { titlu: new RegExp(search, 'i') },
                { descriere: new RegExp(search, 'i') }
            ],
        });

        return await this.coursesService.find(query);
    }
}
