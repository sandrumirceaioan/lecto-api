import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // status
  @Public()
  @Get()
  apiStatus(): string {
    return this.appService.status();
  }

}
