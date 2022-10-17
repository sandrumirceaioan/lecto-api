import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { PagesController } from './pages.controller';
import { Page, PageSchema } from './pages.schema';
import { PagesService } from './pages.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Page.name, schema: PageSchema }
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [PagesController],
  providers: [PagesService],
  exports: [PagesService]
})
export class PagesModule { }
