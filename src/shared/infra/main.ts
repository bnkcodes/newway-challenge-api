import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './error/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());

  SwaggerModule.setup(
    'doc/api',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Newway Challenge')
        .setVersion('1.0')
        .addBearerAuth()
        .build(),
    ),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port, null, () => {
    console.log(`Application is running on: http://localhost:${port}`);
  });
}

void bootstrap();
