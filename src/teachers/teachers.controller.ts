import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, SetMetadata, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OneFileInterceptor } from '../common/interceptors/file.interceptor';
import { WebpInterceptor } from '../common/interceptors/webp-converter.interceptor';
import { GetCurrentUserId } from '../common/decorators/current-user-id.decorator';
import { SharedService } from '../common/modules/shared/shared.service';
import { Teacher } from './teachers.schema';
import { TeachersService } from './teachers.service';
import { TeacherImage, TeachersPaginated } from './teachers.types';

@SetMetadata('roles', 'admin')
@Controller('teachers')
export class TeachersController {

    constructor(
        private teachersService: TeachersService,
        private sharedService: SharedService
    ) { }

    // GET TEACHERS
    @HttpCode(HttpStatus.OK)
    @Get('/paginated')
    async getPaginatedTeachers(@Query() params): Promise<TeachersPaginated> {
        let { skip, limit, sort, direction, search } = params;

        let query: any = {};

        if (search) {
            query = Object.assign(query, {
                $or: [
                    { nume: new RegExp(search, 'i') },
                    { experienta: new RegExp(search, 'i') },
                    { descriere: new RegExp(search, 'i') },
                ],
            });
        }

        let options: any = {
            skip: skip ? parseInt(skip) : 0,
            limit: limit ? parseInt(limit) : 10,
        };

        if (sort && direction) {
            options = Object.assign(options, {
                sort: {
                    [sort]: direction === 'asc' ? 1 : -1
                }
            });
        };

        let [teachers, total] = await Promise.all([
            this.teachersService.find(query, options),
            this.teachersService.count(query)
        ]);

        teachers = await this.teachersService.populateTeachersFields(teachers, 'users');

        return { teachers, total };
    }

    // GET ALL TEACHERS
    @HttpCode(HttpStatus.OK)
    @Get('/')
    async getTeachers() {
        return await this.teachersService.find({});
    }

    // GET ONE TEACHER
    @HttpCode(HttpStatus.OK)
    @Get('/:id')
    async getTeacher(
        @Param('id') id: string,
    ) {
        return await this.teachersService.findById(id);
    }

    // CREATE TEACHER
    @UseInterceptors(
        OneFileInterceptor('file', 'assets/profesori'),
        WebpInterceptor('assets/public/profesori', 150),
    )
    @HttpCode(HttpStatus.OK)
    @Post('/create')
    async createTeacher(
        @Body() body: Teacher,
        @UploadedFile() file: Express.Multer.File,
        @GetCurrentUserId() userId: string,
    ) {
        if (file) {
            body.imagine = {
                name: file.originalname,
                file: file,
                small: `${this.sharedService.appUrl}/profesori/${file.originalname.split('.')[0]}-small.webp`,
                original: `${this.sharedService.appUrl}/profesori/${file.originalname.split('.')[0]}.webp`
            };
        } else {
            body.imagine = null;
        }

        return await this.teachersService.save({ ...body, createdBy: userId });
    }

    // UPDATE TEACHER
    @UseInterceptors(
        OneFileInterceptor('file', 'assets/profesori'),
        WebpInterceptor('assets/public/profesori', 150),
    )
    @HttpCode(HttpStatus.OK)
    @Put('/:id')
    async updateTeacher(
        @Param('id') id: string,
        @Body() body: Teacher,
        @UploadedFile() file: Express.Multer.File,
        @GetCurrentUserId() userId: string,
    ) {

        if (file) {
            body.imagine = {
                name: file.originalname,
                file: file,
                small: `${this.sharedService.appUrl}/profesori/${file.originalname.split('.')[0]}-small.webp`,
                original: `${this.sharedService.appUrl}/profesori/${file.originalname.split('.')[0]}.webp`
            };
        } else {
            if (!body.imagine) body.imagine = null;
        }

        return await this.teachersService.findByIdAndUpdate(id, {
            ...body,
            createdBy: userId,
        });
    }

    // DELETE TEACHER
    @HttpCode(HttpStatus.OK)
    @Delete('/:id')
    async deleteTeacher(@Param('id') id: string) {
        return await this.teachersService.remove(id);
    }
}
