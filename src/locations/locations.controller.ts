import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	Req,
	Request,
	SetMetadata,
	UploadedFile,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import { SharedService } from '../common/modules/shared/shared.service';
import { Location } from './locations.schema';
import { User } from '../users/users.schema';
import { LocationsService } from './locations.service';
import { GetCurrentUserId } from '../common/decorators/current-user-id.decorator';
import { ManyFilesInterceptor, OneFileInterceptor } from '../common/interceptors/file.interceptor';
import { WebpInterceptor, WebpsInterceptor } from '../common/interceptors/webp-converter.interceptor';
import { GetCurrentUser } from '../common/decorators/current-user.decorator';
import { Romania } from './locations.json';
import { GalleryImage, Localitate, LocationGroup, LocationsPaginated } from './locations.types';
import { Public } from '../common/decorators/public.decorators';

@SetMetadata('roles', 'admin')
@Controller('locations')
export class LocationsController {
	romania: LocationGroup[];

	constructor(
		private locationsService: LocationsService,
		private sharedService: SharedService,
	) {
		this.romania = Romania;
	}

	// GET PAGINATED LOCATIONS
	@HttpCode(HttpStatus.OK)
	@Get('/paginated')
	async getPaginatedLocations(
		@Query() params,
		@GetCurrentUser() user: User,
	): Promise<LocationsPaginated> {
		let { skip, limit, sort, direction, search } = params;

		let query: any = {};

		if (search) {
			query = Object.assign(query, {
				$or: [
					{ locatie: new RegExp(search, 'i') },
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

		let [locations, total] = await Promise.all([
			this.locationsService.find(query, options),
			this.locationsService.count(query)
		]);

		locations = await this.locationsService.populateLocationFields(locations, 'users');

		return { locations, total };
	}

	// GET ALL LOCATIONS
	@HttpCode(HttpStatus.OK)
	@Get('/')
	async getLocations() {
		return await this.locationsService.find({});
	}

	// GET ONE LOCATIONS
	@HttpCode(HttpStatus.OK)
	@Get('/one/:id')
	async getLocation(@Param('id') id: string) {
		return await this.locationsService.findById(id);
	}

	// CREATE LOCATIONS
	@UseInterceptors(
		ManyFilesInterceptor('images[]', 'assets/locatii'),
		WebpsInterceptor('assets/public/locatii'),
	)
	@HttpCode(HttpStatus.OK)
	@Post('/create')
	async createLocation(
		@Body() body: Location,
		@UploadedFiles() files: Array<Express.Multer.File>,
		@GetCurrentUserId() userId: string,
	) {
		let galerie: GalleryImage[] = JSON.parse(<any>body.galerie);
		if (!galerie || !galerie.length) throw new HttpException('Galeria nu contine imagini', HttpStatus.BAD_REQUEST);
		if (!files || !files.length) throw new HttpException('Nici o imagine nu a fost salvata', HttpStatus.BAD_REQUEST);
		if (files.length !== galerie.length) throw new HttpException('Eroare la salvarea imaginilor', HttpStatus.BAD_REQUEST);

		let mainFound = galerie.find(item => item.main === true);

		body.imagine = {
			name: mainFound ? mainFound.name : galerie[0].name,
			file: mainFound ? files.find(item => mainFound.name === item.originalname) : files[0],
			small: mainFound ?
				`${this.sharedService.appUrl}/locatii/${mainFound.name.split('.')[0]}-small.webp` :
				`${this.sharedService.appUrl}/locatii/${galerie[0].name.split('.')[0]}-small.webp`,
			original: mainFound ?
				`${this.sharedService.appUrl}/locatii/${mainFound.name.split('.')[0]}.webp` :
				`${this.sharedService.appUrl}/locatii/${galerie[0].name.split('.')[0]}.webp`
		};

		body.galerie = files.map(file => {
			let mainStatus = galerie.find(item => item.name === file['originalname']).main;

			return {
				name: file.originalname,
				file: file,
				small: `${this.sharedService.appUrl}/locatii/${file.originalname.split('.')[0]}-small.webp`,
				original: `${this.sharedService.appUrl}/locatii/${file.originalname.split('.')[0]}.webp`,
				main: mainStatus
			}
		});

		if (body.descriere && body.descriere.indexOf('<p data-f-id')) {
			body.descriere = body.descriere.split('<p data-f-id')[0];
		}
		return await this.locationsService.save({
			...body,
			createdBy: userId,
		});
	}


	// UPDATE LOCATION
	@UseInterceptors(
		ManyFilesInterceptor('images[]', 'assets/locatii'),
		WebpsInterceptor('assets/public/locatii'),
	)
	@HttpCode(HttpStatus.OK)
	@Post('/update/:id')
	async updateLocation(
		@Param('id') id: string,
		@Body() body: Location,
		@UploadedFiles() files: Array<Express.Multer.File>,
		@GetCurrentUserId() userId: string,
	) {

		let galerie: GalleryImage[] = JSON.parse(<any>body.galerie);
		if (!galerie || !galerie.length) throw new HttpException('Galeria nu contine imagini', HttpStatus.BAD_REQUEST);

		let mainFound = galerie.find(item => item.main === true);

		body.imagine = {
			name: mainFound ? mainFound.name : galerie[0].name,
			file: mainFound ? mainFound.file : galerie[0].file,
			small: mainFound ?
				`${this.sharedService.appUrl}/locatii/${mainFound.name.split('.')[0]}-small.webp` :
				`${this.sharedService.appUrl}/locatii/${galerie[0].name.split('.')[0]}-small.webp`,
			original: mainFound ?
				`${this.sharedService.appUrl}/locatii/${mainFound.name.split('.')[0]}.webp` :
				`${this.sharedService.appUrl}/locatii/${galerie[0].name.split('.')[0]}.webp`
		};

		body.galerie = galerie.map(file => {
			let mapped = {
				name: file.name,
				file: file.file || {},
				small: file.small ? file.small : `${this.sharedService.appUrl}/locatii/${file.name.split('.')[0]}-small.webp`,
				original: file.original ? file.original : `${this.sharedService.appUrl}/locatii/${file.name.split('.')[0]}.webp`,
				main: file.main
			};
			if (files && files.length) {
				let isNewFile = files.find(item => file.name === item.originalname);
				if (isNewFile) mapped.file = isNewFile;
			}
			return mapped;
		});

		if (body.descriere && body.descriere.indexOf('<p data-f-id')) {
			body.descriere = body.descriere.split('<p data-f-id')[0];
		}

		return await this.locationsService.findByIdAndUpdate(id, {
			...body, createdBy: userId,
		});
	}


	// UPLOAD LOCATION IMAGES
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


	// DELETE ARTICLE
	@HttpCode(HttpStatus.OK)
	@Delete('/:id')
	async deleteArticle(@Param('id') id: string) {
		return await this.locationsService.remove(id);
	}

	// GET ROMANIAN LOCATIONS
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

