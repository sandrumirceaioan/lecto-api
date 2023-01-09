import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
	SetMetadata,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { SharedService } from '../../common/modules/shared/shared.service';
import { User } from '../../users/users.schema';
import { ResortsService } from './resorts.service';
import { GetCurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { OneFileInterceptor } from '../../common/interceptors/file.interceptor';
import { WebpInterceptor, WebpsInterceptor } from '../../common/interceptors/webp-converter.interceptor';
import { GetCurrentUser } from '../../common/decorators/current-user.decorator';
import { Romania } from './../locations.json';
import { CreateResortDTO, Localitate, LocationGroup, ResortsPaginated } from './resorts.types';
import { Public } from '../../common/decorators/public.decorators';

@SetMetadata('roles', 'admin')
@Controller('resorts')
export class ResortsController {
	romania: LocationGroup[];

	constructor(
		private resortsService: ResortsService,
		private sharedService: SharedService,
	) {
		this.romania = Romania;
	}

	// GET PAGINATED RESORTS
	@HttpCode(HttpStatus.OK)
	@Get('/paginated')
	async getPaginatedLocations(
		@Query() params,
		@GetCurrentUser() user: User,
	): Promise<ResortsPaginated> {
		let { skip, limit, sort, direction, search } = params;

		let query: any = {};

		if (search) {
			query = Object.assign(query, {
				$or: [
					{ resort: new RegExp(search, 'i') },
					{ oras: new RegExp(search, 'i') },
					{ judet: new RegExp(search, 'i') }
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

		let [resorts, total] = await Promise.all([
			this.resortsService.find(query, options),
			this.resortsService.count(query)
		]);

		return { resorts, total };
	}

	// GET ALL RESORTS
	@HttpCode(HttpStatus.OK)
	@Get('/')
	async getLocations() {
		return await this.resortsService.find({});
	}

	// GET ONE RESORTS
	@HttpCode(HttpStatus.OK)
	@Get('/one/:id')
	async getLocation(@Param('id') id: string) {
		return await this.resortsService.findById(id);
	}

	// CREATE RESORTS
	@UseInterceptors(
		OneFileInterceptor('file', 'assets/locatii'),
		WebpInterceptor('assets/public/locatii'),
	)
	@HttpCode(HttpStatus.OK)
	@Post('/create')
	async createLocation(
		@Body() body: CreateResortDTO,
		@UploadedFile() file: Express.Multer.File,
		@GetCurrentUserId() userId: string,
	) {
		console.log(body);
        if (file) {
            body.imagine = {
                name: file.originalname,
                file: file,
                small: `${this.sharedService.appUrl}/locatii/${file.originalname.split('.')[0]}-small.webp`,
                original: `${this.sharedService.appUrl}/locatii/${file.originalname.split('.')[0]}.webp`
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

        return await this.resortsService.save({ ...body, createdBy: userId });
	}


	// UPDATE RESORTS
	@UseInterceptors(
		OneFileInterceptor('file', 'assets/locatii'),
		WebpInterceptor('assets/public/locatii'),
	)
	@HttpCode(HttpStatus.OK)
	@Post('/update/:id')
	async updateLocation(
		@Param('id') id: string,
		@Body() body: CreateResortDTO,
		@UploadedFile() file: Express.Multer.File,
		@GetCurrentUserId() userId: string,
	) {

        if (file) {
            body.imagine = {
                name: file.originalname,
                file: file,
                small: `${this.sharedService.appUrl}/locatii/${file.originalname.split('.')[0]}-small.webp`,
                original: `${this.sharedService.appUrl}/locatii/${file.originalname.split('.')[0]}.webp`
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

        return await this.resortsService.findByIdAndUpdate(id, {
            ...body,
            createdBy: userId,
        });
	}


	// UPLOAD RESORT IMAGES
	@UseInterceptors(
		OneFileInterceptor('file', 'assets/locatii'),
		WebpInterceptor('assets/public/locatii', 100),
	)
	@HttpCode(HttpStatus.OK)
	@Post('/content-image-upload')
	async uploadLocationImages(
		@UploadedFile() file: Express.Multer.File,
	): Promise<any> {
		return {
			link: `${this.sharedService.appUrl}/locatii/${file['originalname'].split('.')[0]}.webp`,
		};
	}


	// DELETE RESORT
	@HttpCode(HttpStatus.OK)
	@Delete('/:id')
	async deleteResort(@Param('id') id: string) {
		return await this.resortsService.remove(id);
	}

	// GET ROMANIAN LOCATIONS FOR AUTOCOMPLETE
	@HttpCode(HttpStatus.OK)
	@Public()
	@Get('/filter')
	async getRomanianLocations(
		@Query() params
	) {
		let { search } = params;
		if (!search || search === '') return [];
		return this._filterGroup(search);
	}

	// GET LOCATIONS FOR AUTOCOMPLETE
	@HttpCode(HttpStatus.OK)
	@Public()
	@Get('/search')
	async searchResorts(
		@Query() params
	) {
		let { search } = params;
		if (!search || search === '') return [];

		let query: any = {};

		query = Object.assign(query, {
			$or: [
				{ resort: new RegExp(search, 'i') },
				{ oras: new RegExp(search, 'i') },
				{ judet: new RegExp(search, 'i') }
			],
		});

		return await this.resortsService.find(query);
	}


	private _filterGroup(value: string): LocationGroup[] {
		if (value) {
			return this.romania
				.map(group => ({ nume: group.nume, localitati: this._filter(group.localitati, value) }))
				.filter(group => group.localitati.length > 0);
		}

		return;
	}

	_filter = (localitati: Localitate[], search: string): Localitate[] => {
		const filterValue = search.toLowerCase();
		return localitati.filter(item => item.nume.toLowerCase().includes(filterValue));
	};

}

