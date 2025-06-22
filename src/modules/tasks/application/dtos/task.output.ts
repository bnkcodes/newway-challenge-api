import { TaskEntity, TaskProps } from '@/tasks/domain/task.entity';

export type TaskOutput = TaskProps & {
  id: string;
};

export class TaskOutputMapper {
  static fromEntity(entity: TaskEntity): TaskOutput {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      dueDate: entity.dueDate,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }

  static fromMany(entities: TaskEntity[]): TaskOutput[] {
    return entities.map((entity) => TaskOutputMapper.fromEntity(entity));
  }
}
