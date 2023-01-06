import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SharedService } from '../common/modules/shared/shared.service';
import { pick } from 'lodash';
import { Session, SessionDocument } from './sessions.schema';
import { UsersService } from '../users/users.service';
import { SessionCreateDTO } from './sessions.types';

@Injectable()
export class SessionsService {
    constructor(
        @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
        private sharedService: SharedService,
        private usersService: UsersService
    ) { }

    async save(session: SessionCreateDTO): Promise<Session> {
        session.createdBy = this.sharedService.toObjectId(session.createdBy);
        return new this.sessionModel(session).save();
    }

    async find(query, options?): Promise<Session[]> {
        options = this.sharedService.validateOptions(options);
        return this.sessionModel.find(query).sort(options.sort).skip(options.skip).limit(options.limit).select(options.select).populate('createdBy', 'email').populate({
            path: 'cursuri',
            populate: [
                {
                    path: 'data',
                    model: 'Course'
                },
                {
                    path: 'teachers',
                    model: 'Teacher',
                }]
        }).populate({
            path: 'locatii',
            populate: [
                {
                    path: 'data',
                    model: 'Location'
                }
            ]
        }).lean();
    }

    // [
    //     {
    //         path: 'createdBy',
    //         select: 'email',
    //     },
    //     {
    //         path: 'locatie.data',
    //         match: 'locatie'
    //     },
    //     {
    //         path: 'cursuri.data'
    //     },
    //     {
    //         path: 'cursuri.teachers'
    //     }
    // ]

    async findOne(query, options?): Promise<Session> {
        options = this.sharedService.validateOptions(options);
        return this.sessionModel.findOne(query).select(options.select).populate('createdBy', 'email').lean();
    }

    async findById(id, options?): Promise<Session> {
        options = this.sharedService.validateOptions(options);
        return this.sessionModel.findById(id).select(options.select).populate('createdBy', 'email').populate({
            path: 'cursuri',
            populate: [
                {
                    path: 'data',
                    model: 'Course'
                },
                {
                    path: 'teachers',
                    model: 'Teacher',
                }]
        }).populate({
            path: 'locatii',
            populate: [
                {
                    path: 'data',
                    model: 'Location'
                }
            ]
        }).lean();
    }

    async findByIds(ids: string[], options?) {
        options = this.sharedService.validateOptions(options);
        return this.sessionModel.find({ '_id': { $in: ids } }).sort(options.sort).skip(options.skip).limit(options.limit).select(options.select).populate('createdBy', 'email').lean();
    }

    async findOneAndUpdate(query, update, options?): Promise<Session> {
        update.createdBy = this.sharedService.toObjectId(update.createdBy);
        options = this.sharedService.validateOptions(options);
        return this.sessionModel.findOneAndUpdate(query, update, pick(options, "new", "upsert")).lean();
    }

    async findByIdAndUpdate(id, update, options?): Promise<Session> {
        update.createdBy = this.sharedService.toObjectId(update.createdBy);
        options = this.sharedService.validateOptions(options);
        return this.sessionModel.findByIdAndUpdate(id, update, pick(options, "new", "upsert")).lean();
    }

    async count(query): Promise<number> {
        return this.sessionModel.countDocuments(query).lean();
    }

    async remove(id) {
        return this.sessionModel.findByIdAndRemove(id);
    }

    // HELPERS

}
