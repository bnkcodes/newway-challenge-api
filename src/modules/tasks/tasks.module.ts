import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import {
  TaskRepository,
  TaskRepositoryName,
} from '@/tasks/domain/task.repository';

import { UserModule } from '../users/users.module';
import {
  UserRepository,
  UserRepositoryName,
} from '../users/domain/user.repository';

import { TaskPrismaRepository } from './infrastructure/database/prisma/task.prisma.repository';
import { TasksController } from './infrastructure/presentation/tasks.controller';
import { TaskFacade } from './infrastructure/task.facade';

@Module({
  imports: [UserModule],
  controllers: [TasksController],
  providers: [
    PrismaClient,
    {
      provide: TaskRepositoryName,
      useClass: TaskPrismaRepository,
    },
    {
      provide: TaskFacade.name,
      useFactory: (
        taskRepository: TaskRepository,
        userRepository: UserRepository,
      ) => {
        return new TaskFacade(taskRepository, userRepository);
      },
      inject: [TaskRepositoryName, UserRepositoryName],
    },
  ],
})
export class TasksModule {}
