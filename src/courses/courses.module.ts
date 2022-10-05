import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { CoursesController } from './courses.controller';
import { Course, CourseSchema } from './courses.schema';
import { CoursesService } from './courses.service';

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
export class CoursesModule { }
