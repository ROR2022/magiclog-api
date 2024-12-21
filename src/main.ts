import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import { HttpExceptionFilter } from './filters/http-exception.filter';
//import { setCorsBucket } from './lib/awsLib';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(bodyParser.json({ limit: configService.get('LIMIT_SIZEFILE') }));
  app.use(
    bodyParser.urlencoded({
      limit: configService.get('LIMIT_SIZEFILE'),
      extended: true,
    }),
  );

  await app.listen(port || 5000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  //setCorsBucket();
}
bootstrap();
