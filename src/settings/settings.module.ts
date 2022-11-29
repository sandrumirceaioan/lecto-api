import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Settings, SettingsSchema } from './settings.schema';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { UsersModule } from '..//users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Settings.name, schema: SettingsSchema }
        ]),
        forwardRef(() => UsersModule),
    ],
    controllers: [SettingsController],
    providers: [SettingsService]
})
export class SettingsModule { }
