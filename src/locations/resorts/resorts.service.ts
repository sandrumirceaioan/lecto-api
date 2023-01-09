import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resort, ResortsDocument } from './resorts.schema';
import { SharedService } from '../../common/modules/shared/shared.service';
import { pick } from 'lodash';
import { CreateResortDTO } from './resorts.types';

@Injectable()
export class ResortsService {
	constructor(
		@InjectModel(Resort.name) private resortModel: Model<ResortsDocument>,
		private sharedService: SharedService,
	) { }

	async save(resort: CreateResortDTO): Promise<Resort> {
		resort.createdBy = this.sharedService.toObjectId(resort.createdBy);
		return new this.resortModel(resort).save();
	}

	async find(query, options?): Promise<Resort[]> {
		options = this.sharedService.validateOptions(options);
		return this.resortModel.find(query).sort(options.sort).skip(options.skip).limit(options.limit).select(options.select).populate('createdBy', 'email').lean();
	}

	async findOne(query, options?): Promise<Resort> {
		options = this.sharedService.validateOptions(options);
		return this.resortModel.findOne(query).select(options.select).populate('createdBy', 'email').lean();
	}

	async findById(id, options?): Promise<Resort> {
		options = this.sharedService.validateOptions(options);
		return this.resortModel.findById(id).select(options.select).populate('createdBy', 'email').lean();
	}

	async findByIds(ids: string[], options?) {
		options = this.sharedService.validateOptions(options);
		return this.resortModel.find({ _id: { $in: ids } }).sort(options.sort).skip(options.skip).limit(options.limit).select(options.select).populate('createdBy', 'email').lean();
	}

	async findOneAndUpdate(query, update, options?): Promise<Resort> {
		update.createdBy = this.sharedService.toObjectId(update.createdBy);
		options = this.sharedService.validateOptions(options);
		return this.resortModel
			.findOneAndUpdate(query, update, pick(options, 'new', 'upsert'))
			.lean();
	}

	async findByIdAndUpdate(id, update, options?): Promise<Resort> {
		update.createdBy = this.sharedService.toObjectId(update.createdBy);
		options = this.sharedService.validateOptions(options);
		return this.resortModel
			.findByIdAndUpdate(id, update, pick(options, 'new', 'upsert'))
			.lean();
	}

	async count(query): Promise<number> {
		return this.resortModel.countDocuments(query).lean();
	}

	async remove(id) {
		return this.resortModel.findByIdAndRemove(id);
	}

	// HELPERS

}
