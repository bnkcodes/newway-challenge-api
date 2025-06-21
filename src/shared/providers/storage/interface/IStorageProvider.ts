import {
  DeleteFileInput,
  DeleteFileOutput,
} from '@/shared/providers/storage/types/delete-file';
import {
  SendFileInput,
  SendFileOutput,
} from '@/shared/providers/storage/types/send-file';

export abstract class IStorageProvider {
  abstract saveFile(data: SendFileInput): Promise<SendFileOutput>;
  abstract deleteFile(data: DeleteFileInput): Promise<DeleteFileOutput>;
}
