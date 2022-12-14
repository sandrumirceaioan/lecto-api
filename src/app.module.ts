import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './common/modules/shared/shared.module';
import { UsersModule } from './users/users.module';
import { AtGuard } from './common/guards/jwt-at.guard';
import { RolesGuard } from './common/guards/role.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DiscountsModule } from './discounts/discounts.module';
import { LocationsModule } from './locations/locations.module';
import { TeachersModule } from './teachers/teachers.module';
import { CoursesModule } from './courses/courses.module';
import { SessionsModule } from './sessions/sessions.module';
import { PagesModule } from './pages/pages.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets/logos'),
      renderPath: '/logos'
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('CONNECTION_STRING'),
        useNewUrlParser: true,
      }),
      inject: [ConfigService],
    }),
    SharedModule,
    AuthModule,
    UsersModule,
    DiscountsModule,
    LocationsModule,
    TeachersModule,
    CoursesModule,
    SessionsModule,
    PagesModule,
    SettingsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ],
})
export class AppModule { }
