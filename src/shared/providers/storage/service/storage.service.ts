import { Injectable, Inject } from '@nestjs/common';

import { EnvironmentVariables, EnvironmentVariablesType } from '@/config/env';

import { BunnyGateway } from '../gateways/bunny.gateway';
import { S3Gateway } from '../gateways/s3.gateway';
import { IStorageProvider } from '../interface/IStorageProvider';

@Injectable()
export class StorageProvider {
  private provider: IStorageProvider;

  constructor(
    @Inject(EnvironmentVariables.KEY)
    private readonly config: EnvironmentVariablesType,
    private readonly bunnyGateway: BunnyGateway,
    private readonly s3Gateway: S3Gateway,
  ) {
    const providers = {
      bunny: this.bunnyGateway,
      s3: this.s3Gateway,
    };

    return providers[this.config.app.driver.storageDriver];
  }

  getProvider(): IStorageProvider {
    return this.provider;
  }
}
