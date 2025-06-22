import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EnvironmentVariables, EnvironmentVariablesSchema } from '@/config/env';

import { modules } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvironmentVariables],
      validationSchema: EnvironmentVariablesSchema,
    }),
    ...modules,
  ],
  controllers: [],
})
export class AppModule {}
