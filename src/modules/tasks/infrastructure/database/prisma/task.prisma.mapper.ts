import { Task } from '@prisma/client';

import { TaskEntity } from '@/tasks/domain/task.entity';

export class TaskPrismaMapper {
  static toEntity(model: Task): TaskEntity {
    return new TaskEntity(
      {
        title: model.title,
        description: model.description,
        status: model.status,
        dueDate: model.dueDate,
        userId: model.userId,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
        deletedAt: model.deletedAt,
      },
      model.id,
    );
  }
}
