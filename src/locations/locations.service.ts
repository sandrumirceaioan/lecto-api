import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationsDocument } from './locations.schema';
import { SharedService } from '../common/modules/shared/shared.service';
import { pick } from 'lodash';
import { CreateLocationDTO } from './locations.types';

@Injectable()
export class LocationsService {
	constructor(
		@InjectModel(Location.name) private locationModel: Model<LocationsDocument>,
		private sharedService: SharedService,
	) { }

	async save(location: CreateLocationDTO): Promise<Location> {
		location.createdBy = this.sharedService.toObjectId(location.createdBy);
		return new this.locationModel(location).save();
	}

	async find(query, options?): Promise<Location[]> {
		options = this.sharedService.validateOptions(options);
		return this.locationModel.find(query).sort(options.sort).skip(options.skip).limit(options.limit).select(options.select).populate('createdBy', 'email').lean();
	}

	async findOne(query, options?): Promise<Location> {
		options = this.sharedService.validateOptions(options);
		return this.locationModel.findOne(query).select(options.select).populate('createdBy', 'email').lean();
	}

	async findById(id, options?): Promise<Location> {
		options = this.sharedService.validateOptions(options);
		return this.locationModel.findById(id).select(options.select).populate('createdBy', 'email').lean();
	}

	async findByIds(ids: string[], options?) {
		options = this.sharedService.validateOptions(options);
		return this.locationModel.find({ _id: { $in: ids } }).sort(options.sort).skip(options.skip).limit(options.limit).select(options.select).populate('createdBy', 'email').lean();
	}

	async findOneAndUpdate(query, update, options?): Promise<Location> {
		update.createdBy = this.sharedService.toObjectId(update.createdBy);
		options = this.sharedService.validateOptions(options);
		return this.locationModel
			.findOneAndUpdate(query, update, pick(options, 'new', 'upsert'))
			.lean();
	}

	async findByIdAndUpdate(id, update, options?): Promise<Location> {
		update.createdBy = this.sharedService.toObjectId(update.createdBy);
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

}
