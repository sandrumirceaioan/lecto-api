import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  app.use(bodyParser.json({ limit: '100mb' }));

  // sets app main route
  app.setGlobalPrefix('api');

  // used for error global filter
  app.useGlobalFilters(new AllExceptionsFilter());
  
  // use for dto validation
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useStaticAssets(join(__dirname, '../assets/locatii'), { prefix: '/locatii'});
  app.useStaticAssets(join(__dirname, '../assets/public/locatii'), { prefix: '/locatii'});

  app.useStaticAssets(join(__dirname, '../assets/profesori'), { prefix: '/profesori'});
  app.useStaticAssets(join(__dirname, '../assets/public/profesori'), { prefix: '/profesori'});

  app.useStaticAssets(join(__dirname, '../assets/cursuri'), { prefix: '/cursuri'});
  app.useStaticAssets(join(__dirname, '../assets/public/cursuri'), { prefix: '/cursuri'});

  app.useStaticAssets(join(__dirname, '../assets/sesiuni'), { prefix: '/sesiuni'});
  app.useStaticAssets(join(__dirname, '../assets/public/sesiuni'), { prefix: '/sesiuni'});

  app.useStaticAssets(join(__dirname, '../assets/pagini'), { prefix: '/pagini'});
  app.useStaticAssets(join(__dirname, '../assets/public/pagini'), { prefix: '/pagini'});

  const port = config.get('PORT');
  await app.listen(port || 3000);
}
bootstrap();
