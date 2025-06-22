import { TaskEntity } from '@/tasks/domain/task.entity';
import { ErrorException } from '@/shared/infra/error/error-exception';
import { ErrorCode } from '@/shared/infra/error/error-code';

export function validateTaskOwnership(requesterId: string, task: TaskEntity) {
  if (task.userId !== requesterId) {
    throw new ErrorException(
      ErrorCode.Forbidden,
      'Você não possui permissão para acessar esta tarefa.',
    );
  }
}
