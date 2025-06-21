import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

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
