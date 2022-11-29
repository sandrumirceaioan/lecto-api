import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, SetMetadata } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorators';
import { GetCurrentUserId } from '../common/decorators/current-user-id.decorator';
import { SharedService } from '../common/modules/shared/shared.service';
import { SettingsService } from './settings.service';
import { SettingsDTO } from './settings.types';

@SetMetadata('roles', 'admin')
@Controller('settings')
export class SettingsController {

    constructor(
        private settingsService: SettingsService,
        private sharedService: SharedService
    ) { }

    // SAVE SETTINGS
    @HttpCode(HttpStatus.OK)
    @Post('/save')
    async createPage(
        @Body() body: SettingsDTO,
        @GetCurrentUserId() userId: string,
    ) {
        let currentSettings = await this.settingsService.findOne({});
        if (!currentSettings) {
            return await this.settingsService.save({ ...body, createdBy: userId });
        } else {
            return await this.settingsService.findOneAndUpdate({}, { ...body, createdBy: userId });
        }
    }

    // GET SETTINGS
    @Public()
    @HttpCode(HttpStatus.OK)
    @Get('/')
    async getSettings() {
        return await this.settingsService.findOne({});
    }
}
