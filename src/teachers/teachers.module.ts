import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { TeachersController } from './teachers.controller';
import { Teacher, TeacherSchema } from './teachers.schema';
import { TeachersService } from './teachers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Teacher.name, schema: TeacherSchema }
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService]
})
export class TeachersModule { }
