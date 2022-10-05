import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SharedService } from '../common/modules/shared/shared.service';
import { pick } from 'lodash';
import { Course, CourseDocument } from './courses.schema';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.schema';

@Injectable()
export class CoursesService {
    constructor(
        @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
        private sharedService: SharedService,
        private usersService: UsersService
    ) { }

    async save(course: Course): Promise<Course> {
        return new this.courseModel(course).save();
    }

    async find(query, options?): Promise<Course[]> {
        options = this.sharedService.validateOptions(options);
        return this.courseModel.find(query).sort(options.sort).skip(options.skip).limit(options.limit).select(options.select).lean();
    }

    async findOne(query, options?): Promise<Course> {
        options = this.sharedService.validateOptions(options);
        return this.courseModel.findOne(query).select(options.select).lean();
    }

    async findById(id, options?): Promise<Course> {
        options = this.sharedService.validateOptions(options);
        return this.courseModel.findById(id).select(options.select).lean();
    }

    async findByIds(ids: string[], options?) {
        options = this.sharedService.validateOptions(options);
        return this.courseModel.find({ '_id': { $in: ids } }).sort(options.sort).skip(options.skip).limit(options.limit).select(options.select).lean();
    }

    async findOneAndUpdate(query, update, options?): Promise<Course> {
        options = this.sharedService.validateOptions(options);
        return this.courseModel.findOneAndUpdate(query, update, pick(options, "new", "upsert")).lean();
    }

    async findByIdAndUpdate(id, update, options?): Promise<Course> {
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

    public async populateCoursesFields(courses: Course[], ...methods: Array<string>) {
        for await (const method of methods) {
            if (method === 'users') {
                courses = await this.attachUsersToCourses(courses);
            }
        }
        return courses;
    }

    public async attachUsersToCourses(courses: Course[]): Promise<Course[]> {
        const users: User[] = await this.usersService.find({}, { select: 'email' });

        return courses.map((course) => {
            course.createdBy = users.find((user: User) => (<any>user)._id.toString() === course.createdBy).email;
            return course;
        });
    }
}
