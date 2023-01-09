import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { LocationsController } from './locations.controller';
import { Location, LocationSchema } from './locations.schema';
import { LocationsService } from './locations.service';
import { ResortsController } from './resorts/resorts.controller';
import { Resort, ResortSchema } from './resorts/resorts.schema';
import { ResortsService } from './resorts/resorts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
      { name: Resort.name, schema: ResortSchema }
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [LocationsController, ResortsController],
  providers: [LocationsService, ResortsService],
  exports: [LocationsService, ResortsService]
})
export class LocationsModule { }
