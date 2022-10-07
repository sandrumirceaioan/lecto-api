import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SharedService } from '../common/modules/shared/shared.service';
import { pick } from 'lodash';
import { Course, CourseDocument } from './sessions.schema';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.schema';
import { CreateCourseDTO } from './sessions.types';

@Injectable()
export class CoursesService {
    constructor(
        @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
        private sharedService: SharedService,
        private usersService: UsersService
    ) { }

    async save(course: CreateCourseDTO): Promise<Course> {
        course.createdBy = this.sharedService.toObjectId(course.createdBy);
        return new this.courseModel(course).save();
    }

    async find(query, options?): Promise<Course[]> {
        options = this.sharedService.validateOptions(options);
        return this.courseModel.find(query).sort(options.sort).skip(options.skip).limit(options.limit).select(options.select).populate('createdBy', 'email').lean();
    }

    async findOne(query, options?): Promise<Course> {
        options = this.sharedService.validateOptions(options);
        return this.courseModel.findOne(query).select(options.select).populate('createdBy', 'email').lean();
    }

    async findById(id, options?): Promise<Course> {
        options = this.sharedService.validateOptions(options);
        return this.courseModel.findById(id).select(options.select).populate('createdBy', 'email').lean();
    }

    async findByIds(ids: string[], options?) {
        options = this.sharedService.validateOptions(options);
        return this.courseModel.find({ '_id': { $in: ids } }).sort(options.sort).skip(options.skip).limit(options.limit).select(options.select).populate('createdBy', 'email').lean();
    }

    async findOneAndUpdate(query, update, options?): Promise<Course> {
        update.createdBy = this.sharedService.toObjectId(update.createdBy);
        options = this.sharedService.validateOptions(options);
        return this.courseModel.findOneAndUpdate(query, update, pick(options, "new", "upsert")).lean();
    }

    async findByIdAndUpdate(id, update, options?): Promise<Course> {
        update.createdBy = this.sharedService.toObjectId(update.createdBy);
        options = this.sharedService.validateOptions(options);
        return this.courseModel.findByIdAndUpdate(id, update, pick(options, "new", "upsert")).lean();
    }

    async count(query): Promise<number> {
        return this.courseModel.countDocuments(query).lean();
    }

    async remove(id) {
        return this.courseModel.findByIdAndRemove(id);
    }

    // HELPERS

}
