import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SharedService } from '../common/modules/shared/shared.service';
import { pick } from 'lodash';
import { Teacher, TeacherDocument } from './teachers.schema';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.schema';
import { CreateTeacherDTO } from './teachers.types';


@Injectable()
export class TeachersService {
    constructor(
        @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
        private sharedService: SharedService
    ) { }

    async save(teacher: CreateTeacherDTO): Promise<Teacher> {
        teacher.createdBy = this.sharedService.toObjectId(teacher.createdBy);
        return new this.teacherModel(teacher).save();
    }

    async find(query, options?): Promise<Teacher[]> {
        options = this.sharedService.validateOptions(options);
        return this.teacherModel.find(query).sort(options.sort).skip(options.skip).limit(options.limit).select(options.select).populate('createdBy', 'email').lean();
    }

    async findOne(query, options?): Promise<Teacher> {
        options = this.sharedService.validateOptions(options);
        return this.teacherModel.findOne(query).select(options.select).populate('createdBy', 'email').lean();
    }

    async findById(id, options?): Promise<Teacher> {
        options = this.sharedService.validateOptions(options);
        return this.teacherModel.findById(id).select(options.select).populate('createdBy', 'email').lean();
    }

    async findByIds(ids: string[], options?) {
        options = this.sharedService.validateOptions(options);
        return this.teacherModel.find({ '_id': { $in: ids } }).sort(options.sort).skip(options.skip).limit(options.limit).select(options.select).populate('createdBy', 'email').lean();
    }

    async findOneAndUpdate(query, update, options?): Promise<Teacher> {
        update.createdBy = this.sharedService.toObjectId(update.createdBy);
        options = this.sharedService.validateOptions(options);
        return this.teacherModel.findOneAndUpdate(query, update, pick(options, "new", "upsert")).lean();
    }

    async findByIdAndUpdate(id, update, options?): Promise<Teacher> {
        update.createdBy = this.sharedService.toObjectId(update.createdBy);
        options = this.sharedService.validateOptions(options);
        return this.teacherModel.findByIdAndUpdate(id, update, pick(options, "new", "upsert")).lean();
    }

    async count(query): Promise<number> {
        return this.teacherModel.countDocuments(query).lean();
    }

    async remove(id) {
        return this.teacherModel.findByIdAndRemove(id);
    }

    // HELPERS

}
