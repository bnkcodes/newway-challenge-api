import { Module } from '@nestjs/common';

import { BunnyGateway } from './gateways/bunny.gateway';
import { S3Gateway } from './gateways/s3.gateway';
import { IStorageProvider } from './interface/IStorageProvider';
import { StorageProvider } from './service/storage.service';

@Module({
  providers: [
    { provide: IStorageProvider, useClass: StorageProvider },
    BunnyGateway,
    S3Gateway,
  ],
  exports: [
    { provide: IStorageProvider, useClass: StorageProvider },
    BunnyGateway,
    S3Gateway,
  ],
})
export class StorageModule {}
