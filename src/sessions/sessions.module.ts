import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { CoursesController } from './sessions.controller';
import { Course, CourseSchema } from './sessions.schema';
import { CoursesService } from './sessions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema }
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService]
})
export class SessionsModule { }
