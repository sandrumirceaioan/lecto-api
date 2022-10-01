import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { LocationsController } from './locations.controller';
import { Location, LocationSchema } from './locations.schema';
import { LocationsService } from './locations.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema }
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService]
})
export class LocationsModule { }
