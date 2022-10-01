import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationsDocument } from './locations.schema';
import { SharedService } from '../common/modules/shared/shared.service';
import { pick, uniq } from 'lodash';
import { User } from '../users/users.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class LocationsService {
	constructor(
		@InjectModel(Location.name) private locationModel: Model<LocationsDocument>,
		private sharedService: SharedService,
		private usersService: UsersService,
	) { }

	async save(location: Location): Promise<Location> {
		return new this.locationModel(location).save();
	}

	async find(query, options?): Promise<Location[]> {
		options = this.sharedService.validateOptions(options);
		return this.locationModel.find(query).sort(options.sort).skip(options.skip).limit(options.limit).select(options.select).lean();
	}

	async findOne(query, options?): Promise<Location> {
		options = this.sharedService.validateOptions(options);
		return this.locationModel.findOne(query).select(options.select).lean();
	}

	async findById(id, options?): Promise<Location> {
		options = this.sharedService.validateOptions(options);
		return this.locationModel.findById(id).select(options.select).lean();
	}

	async findByIds(ids: string[], options?) {
		options = this.sharedService.validateOptions(options);
		return this.locationModel.find({ _id: { $in: ids } }).sort(options.sort).skip(options.skip).limit(options.limit).select(options.select).lean();
	}

	async findOneAndUpdate(query, update, options?): Promise<Location> {
		options = this.sharedService.validateOptions(options);
		return this.locationModel
			.findOneAndUpdate(query, update, pick(options, 'new', 'upsert'))
			.lean();
	}

	async findByIdAndUpdate(id, update, options?): Promise<Location> {
		options = this.sharedService.validateOptions(options);
		return this.locationModel
			.findByIdAndUpdate(id, update, pick(options, 'new', 'upsert'))
			.lean();
	}

	async count(query): Promise<number> {
		return this.locationModel.countDocuments(query).lean();
	}

	async remove(id) {
		return this.locationModel.findByIdAndRemove(id);
	}

	// HELPERS

	public async getUsersForLocations(locations: Location[]): Promise<User[]> {
		const userIds: string[] = uniq(
			locations.map((location: Location) => {
				return location.createdBy;
			})
		);

		const users: User[] = await this.usersService.findByIds(userIds);
		return users;
	}

	public async attachUsersToLocations(locations: Location[]): Promise<Location[]> {
		const users: User[] = await this.getUsersForLocations(locations);

		return locations.map((location) => {
			location.createdBy = users.find((user: User) => (<any>user)._id.toString() === location.createdBy).email;
			return location;
		});
	}


	public async populateLocationFields(locations: Location[], ...methods: Array<string>) {
		for await (const method of methods) {
			if (method === 'users') {
				locations = await this.attachUsersToLocations(locations);
			}
		}

		return locations;
	}
}
