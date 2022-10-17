import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SharedService } from '../common/modules/shared/shared.service';
import { pick } from 'lodash';
import { Page, PageDocument } from './pages.schema';
import { UsersService } from '../users/users.service';
import { CreatePageDTO } from './pages.types';

@Injectable()
export class PagesService {
    constructor(
        @InjectModel(Page.name) private pageModel: Model<PageDocument>,
        private sharedService: SharedService,
        private usersService: UsersService
    ) { }

    async save(page: CreatePageDTO): Promise<Page> {
        page.createdBy = this.sharedService.toObjectId(page.createdBy);
        return new this.pageModel(page).save();
    }

    async find(query, options?): Promise<Page[]> {
        options = this.sharedService.validateOptions(options);
        return this.pageModel.find(query).sort(options.sort).skip(options.skip).limit(options.limit).select(options.select).populate('createdBy', 'email').lean();
    }

    async findOne(query, options?): Promise<Page> {
        options = this.sharedService.validateOptions(options);
        return this.pageModel.findOne(query).select(options.select).populate('createdBy', 'email').lean();
    }

    async findById(id, options?): Promise<Page> {
        options = this.sharedService.validateOptions(options);
        return this.pageModel.findById(id).select(options.select).populate('createdBy', 'email').lean();
    }

    async findByIds(ids: string[], options?) {
        options = this.sharedService.validateOptions(options);
        return this.pageModel.find({ '_id': { $in: ids } }).sort(options.sort).skip(options.skip).limit(options.limit).select(options.select).populate('createdBy', 'email').lean();
    }

    async findOneAndUpdate(query, update, options?): Promise<Page> {
        update.createdBy = this.sharedService.toObjectId(update.createdBy);
        options = this.sharedService.validateOptions(options);
        return this.pageModel.findOneAndUpdate(query, update, pick(options, "new", "upsert")).lean();
    }

    async findByIdAndUpdate(id, update, options?): Promise<Page> {
        update.createdBy = this.sharedService.toObjectId(update.createdBy);
        options = this.sharedService.validateOptions(options);
        return this.pageModel.findByIdAndUpdate(id, update, pick(options, "new", "upsert")).lean();
    }

    async count(query): Promise<number> {
        return this.pageModel.countDocuments(query).lean();
    }

    async remove(id) {
        return this.pageModel.findByIdAndRemove(id);
    }

    // HELPERS

}
