import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, SetMetadata, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OneFileInterceptor } from '../common/interceptors/file.interceptor';
import { WebpInterceptor } from '../common/interceptors/webp-converter.interceptor';
import { GetCurrentUserId } from '../common/decorators/current-user-id.decorator';
import { SharedService } from '../common/modules/shared/shared.service';
import { Page } from './pages.schema';
import { PagesService } from './pages.service';
import { PagesPaginated, CreatePageDTO } from './pages.types';

@SetMetadata('roles', 'admin')
@Controller('pages')
export class PagesController {

    constructor(
        private pagesService: PagesService,
        private sharedService: SharedService
    ) { }

    // GET PAGES
    @HttpCode(HttpStatus.OK)
    @Get('/paginated')
    async getPaginatedPages(@Query() params): Promise<PagesPaginated> {
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

        let [pages, total] = await Promise.all([
            this.pagesService.find(query, options),
            this.pagesService.count(query)
        ]);

        return { pages, total };
    }

    // GET ALL PAGES
    @HttpCode(HttpStatus.OK)
    @Get('/')
    async getPages() {
        return await this.pagesService.find({});
    }

    // GET ONE PAGE
    @HttpCode(HttpStatus.OK)
    @Get('/:id')
    async getPage(
        @Param('id') id: string,
    ) {
        return await this.pagesService.findById(id);
    }

    // CREATE PAGE
    @UseInterceptors(
        OneFileInterceptor('file', 'assets/pagini'),
        WebpInterceptor('assets/public/pagini', 150),
    )
    @HttpCode(HttpStatus.OK)
    @Post('/create')
    async createPage(
        @Body() body: CreatePageDTO,
        @UploadedFile() file: Express.Multer.File,
        @GetCurrentUserId() userId: string,
    ) {

        if (file) {
            body.imagine = {
                name: file.originalname,
                file: file,
                small: `${this.sharedService.appUrl}/pagini/${file.originalname.split('.')[0]}-small.webp`,
                original: `${this.sharedService.appUrl}/pagini/${file.originalname.split('.')[0]}.webp`
            };
        } else {
            if (body.imagine) {
                body.imagine = JSON.parse(<any>body.imagine);
            } else {
                body.imagine = null;
            }
        }

        if (body.descriere && body.descriere.indexOf('<p data-f-id')) {
			body.descriere = body.descriere.split('<p data-f-id')[0];
		}

        return await this.pagesService.save({ ...body, createdBy: userId });
    }

    // UPDATE PAGE
    @UseInterceptors(
        OneFileInterceptor('file', 'assets/pagini'),
        WebpInterceptor('assets/public/pagini', 150),
    )
    @HttpCode(HttpStatus.OK)
    @Put('/:id')
    async updatePage(
        @Param('id') id: string,
        @Body() body: CreatePageDTO,
        @UploadedFile() file: Express.Multer.File,
        @GetCurrentUserId() userId: string,
    ) {

        if (file) {
            body.imagine = {
                name: file.originalname,
                file: file,
                small: `${this.sharedService.appUrl}/pagini/${file.originalname.split('.')[0]}-small.webp`,
                original: `${this.sharedService.appUrl}/pagini/${file.originalname.split('.')[0]}.webp`
            };
        } else {
            if (body.imagine) {
                body.imagine = JSON.parse(<any>body.imagine);
            } else {
                body.imagine = null;
            }
        }

        if (body.descriere && body.descriere.indexOf('<p data-f-id')) {
			body.descriere = body.descriere.split('<p data-f-id')[0];
		}

        return await this.pagesService.findByIdAndUpdate(id, {
            ...body,
            createdBy: userId,
        });
    }

    // UPLOAD PAGE IMAGES
    @UseInterceptors(
        OneFileInterceptor('file', 'assets/pagini'),
        WebpInterceptor('assets/public/pagini', 100),
    )
    @HttpCode(HttpStatus.OK)
    @Post('/content-image-upload')
    async uploadPageImages(
        @UploadedFile() file: Express.Multer.File,
    ): Promise<any> {
        return {
            link: `${this.sharedService.appUrl}/pagini/${file['originalname'].split('.')[0]}.webp`,
        };
    }

    // DELETE PAGE
    @HttpCode(HttpStatus.OK)
    @Delete('/:id')
    async deletePage(@Param('id') id: string) {
        return await this.pagesService.remove(id);
    }
}
