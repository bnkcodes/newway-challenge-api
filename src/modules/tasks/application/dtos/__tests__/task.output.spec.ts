import { TaskDataBuilder } from '@/tasks/domain/testing/task-data-builder';
import { TaskEntity } from '@/tasks/domain/task.entity';
import { TaskOutputMapper } from '../task.output';

describe('TaskOutputMapper', () => {
  let task: TaskEntity;

  beforeEach(() => {
    const taskData = TaskDataBuilder({});
    task = new TaskEntity(taskData);
  });

  describe('fromEntity', () => {
    it('should map task entity to output', () => {
      const result = TaskOutputMapper.fromEntity(task);

      expect(result).toEqual({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate,
        userId: task.userId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        deletedAt: task.deletedAt,
      });
    });
  });

  describe('fromMany', () => {
    it('should map multiple tasks to output', () => {
      const tasks = [task, task];
      const result = TaskOutputMapper.fromMany(tasks);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(task.id);
      expect(result[1].id).toBe(task.id);
    });
  });
});
