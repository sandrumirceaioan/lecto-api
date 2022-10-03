import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SharedService } from '../common/modules/shared/shared.service';
import { pick } from 'lodash';
import { Teacher, TeacherDocument } from './teachers.schema';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.schema';

@Injectable()
export class TeachersService {
    constructor(
        @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
        private sharedService: SharedService,
        private usersService: UsersService
    ) { }

    async save(teacher: Teacher): Promise<Teacher> {
        return new this.teacherModel(teacher).save();
    }

    async find(query, options?): Promise<Teacher[]> {
        options = this.sharedService.validateOptions(options);
        return this.teacherModel.find(query).sort(options.sort).skip(options.skip).limit(options.limit).select(options.select).lean();
    }

    async findOne(query, options?): Promise<Teacher> {
        options = this.sharedService.validateOptions(options);
        return this.teacherModel.findOne(query).select(options.select).lean();
    }

    async findById(id, options?): Promise<Teacher> {
        options = this.sharedService.validateOptions(options);
        return this.teacherModel.findById(id).select(options.select).lean();
    }

    async findByIds(ids: string[], options?) {
        options = this.sharedService.validateOptions(options);
        return this.teacherModel.find({ '_id': { $in: ids } }).sort(options.sort).skip(options.skip).limit(options.limit).select(options.select).lean();
    }

    async findOneAndUpdate(query, update, options?): Promise<Teacher> {
        options = this.sharedService.validateOptions(options);
        return this.teacherModel.findOneAndUpdate(query, update, pick(options, "new", "upsert")).lean();
    }

    async findByIdAndUpdate(id, update, options?): Promise<Teacher> {
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

    public async populateTeachersFields(teachers: Teacher[], ...methods: Array<string>) {
        for await (const method of methods) {
            if (method === 'users') {
                teachers = await this.attachUsersToTeachers(teachers);
            }
        }
        return teachers;
    }

    public async attachUsersToTeachers(teachers: Teacher[]): Promise<Teacher[]> {
        const users: User[] = await this.usersService.find({}, { select: 'email' });

        return teachers.map((teacher) => {
            teacher.createdBy = users.find((user: User) => (<any>user)._id.toString() === teacher.createdBy).email;
            return teacher;
        });
    }
}
