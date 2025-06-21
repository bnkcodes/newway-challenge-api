import { randomBytes } from 'node:crypto';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

import { EnvironmentVariables, EnvironmentVariablesType } from '@/config/env';

import { IStorageProvider } from '../interface/IStorageProvider';
import { DeleteFileInput, DeleteFileOutput } from '../types/delete-file';
import { SendFileInput, SendFileOutput } from '../types/send-file';

@Injectable()
export class S3Gateway implements IStorageProvider {
  private s3Client: S3Client;

  constructor(
    @Inject(EnvironmentVariables.KEY)
    private readonly config: EnvironmentVariablesType,
  ) {
    this.s3Client = new S3Client({
      region: this.config.s3.region,
      credentials: {
        accessKeyId: this.config.s3.accessKeyId,
        secretAccessKey: this.config.s3.secretAccessKey,
      },
    });
  }

  public async saveFile({
    context,
    file,
  }: SendFileInput): Promise<SendFileOutput> {
    const hash = randomBytes(10).toString('hex');
    const FILE_PATH = `${context}/${hash}.${this.getFileExtension(file.mimetype)}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.config.s3.bucket,
          Key: FILE_PATH,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      return {
        url: `${this.config.s3.baseUrl}/${FILE_PATH}`,
      };
    } catch (error) {
      throw new InternalServerErrorException([error]);
    }
  }

  public async deleteFile({
    path,
  }: DeleteFileInput): Promise<DeleteFileOutput> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.config.s3.bucket,
          Key: path,
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException([error]);
    }
  }

  private getFileExtension(mimetype: string) {
    return mimetype.slice(((mimetype.lastIndexOf('/') - 1) >>> 0) + 2);
  }
}
