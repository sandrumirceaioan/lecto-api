import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SharedService } from '../common/modules/shared/shared.service';
import { pick } from 'lodash';
import { Settings, SettingsDocument } from './settings.schema';
import { SettingsDTO } from './settings.types';

@Injectable()
export class SettingsService {
    constructor(
        @InjectModel(Settings.name) private settingsModel: Model<SettingsDocument>,
        private sharedService: SharedService,
    ) { }

    async save(settings: SettingsDTO): Promise<Settings> {
        settings.createdBy = this.sharedService.toObjectId(settings.createdBy);
        return new this.settingsModel(settings).save();
    }

    async findOne(query, options?): Promise<Settings> {
        options = this.sharedService.validateOptions(options);
        return this.settingsModel.findOne(query).select(options.select).populate('createdBy', 'email').lean();
    }

    async findById(id, options?): Promise<Settings> {
        options = this.sharedService.validateOptions(options);
        return this.settingsModel.findById(id).select(options.select).populate('createdBy', 'email').lean();
    }

    async findOneAndUpdate(query, update, options?): Promise<Settings> {
        update.createdBy = this.sharedService.toObjectId(update.createdBy);
        options = this.sharedService.validateOptions(options);
        return this.settingsModel.findOneAndUpdate(query, update, pick(options, "new", "upsert")).lean();
    }

    async findByIdAndUpdate(id, update, options?): Promise<Settings> {
        update.createdBy = this.sharedService.toObjectId(update.createdBy);
        options = this.sharedService.validateOptions(options);
        return this.settingsModel.findByIdAndUpdate(id, update, pick(options, "new", "upsert")).lean();
    }
    // HELPERS
}
