import { UserRepository } from '@/users/domain/user.repository';
import { TaskRepository } from '@/tasks/domain/task.repository';

import { CreateTaskUseCase } from '@/tasks/application/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from '@/tasks/application/use-cases/delete-task.use-case';
import { UpdateTaskUseCase } from '@/tasks/application/use-cases/update-task.use-case';
import { ListTasksUseCase } from '@/tasks/application/use-cases/list-tasks.use-case';
import { GetTaskUseCase } from '@/tasks/application/use-cases/get-task.use-case';

export class TaskFacade {
  createTaskUseCase: CreateTaskUseCase;
  deleteTaskUseCase: DeleteTaskUseCase;
  getTaskUseCase: GetTaskUseCase;
  listTasksUseCase: ListTasksUseCase;
  updateTaskUseCase: UpdateTaskUseCase;

  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userRepository: UserRepository,
  ) {
    this.createTaskUseCase = new CreateTaskUseCase(
      taskRepository,
      userRepository,
    );
    this.deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
    this.getTaskUseCase = new GetTaskUseCase(taskRepository);
    this.listTasksUseCase = new ListTasksUseCase(taskRepository);
    this.updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
  }
}
