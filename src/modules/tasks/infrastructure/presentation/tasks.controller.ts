import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { Authenticated, Role } from '@/shared/decorators';
import { CollectionInput } from '@/shared/infra/dto/collection.dto';
import { AuthenticatedPayload } from '@/shared/types/payload-jwt';

import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TaskFacade } from '../task.facade';

import {
  TaskCollectionPresenter,
  TaskPresenter,
  TaskPresenterWrapper,
} from '../presenters/task.presenter';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  @Inject(TaskFacade.name)
  private taskFacade: TaskFacade;

  @Post()
  @Role(UserRole.USER)
  @ApiOperation({ summary: 'Criar tarefa' })
  @ApiResponse({ status: 201, type: TaskPresenterWrapper })
  async create(
    @Authenticated() user: AuthenticatedPayload,
    @Body() input: CreateTaskDto,
  ): Promise<TaskPresenterWrapper> {
    const { task } = await this.taskFacade.createTaskUseCase.execute({
      ...input,
      dueDate: new Date(input.dueDate),
      userId: user.id,
    });

    return new TaskPresenterWrapper(TaskPresenter.fromOutput(task));
  }

  @Get()
  @Role(UserRole.USER)
  @ApiOperation({ summary: 'Listar tarefas do usuário logado' })
  @ApiResponse({ status: 200, type: TaskCollectionPresenter })
  async list(
    @Authenticated() user: AuthenticatedPayload,
    @Query() queryParams?: CollectionInput,
  ): Promise<TaskCollectionPresenter> {
    const data = await this.taskFacade.listTasksUseCase.execute({
      filter: {
        userId: user.id,
      },
      page: queryParams?.page || 1,
      pageSize: queryParams?.pageSize || 10,
      sortBy: queryParams?.sortBy ?? 'createdAt',
      sortDirection:
        queryParams?.sortDirection?.toLowerCase() === 'desc' ? 'desc' : 'asc',
    });

    return new TaskCollectionPresenter(
      TaskPresenter.fromMany(data.tasks),
      data.totalCount,
      data.page,
      data.pageSize,
    );
  }

  @Get('user/:userId')
  @Role(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Listar todas as tarefas de um usuário específico (Apenas Admin)',
  })
  @ApiResponse({ status: 200, type: TaskCollectionPresenter })
  async listByUser(
    @Param('userId') userId: string,
    @Query() queryParams?: CollectionInput,
  ): Promise<TaskCollectionPresenter> {
    const data = await this.taskFacade.listTasksUseCase.execute({
      filter: {
        userId: userId,
      },
      page: queryParams?.page || 1,
      pageSize: queryParams?.pageSize || 10,
      sortBy: queryParams?.sortBy ?? 'createdAt',
      sortDirection:
        queryParams?.sortDirection?.toLowerCase() === 'desc' ? 'desc' : 'asc',
    });

    return new TaskCollectionPresenter(
      TaskPresenter.fromMany(data.tasks),
      data.totalCount,
      data.page,
      data.pageSize,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar tarefa' })
  @ApiResponse({ status: 200, type: TaskPresenterWrapper })
  async update(
    @Authenticated() user: AuthenticatedPayload,
    @Param('id') id: string,
    @Body() input: UpdateTaskDto,
  ): Promise<TaskPresenterWrapper> {
    const { task } = await this.taskFacade.updateTaskUseCase.execute({
      id,
      userId: user.id,
      userRole: user.role,
      ...input,
      ...(input.dueDate && { dueDate: new Date(input.dueDate) }),
    });

    return new TaskPresenterWrapper(TaskPresenter.fromOutput(task));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar tarefa' })
  @ApiResponse({ status: 204 })
  async delete(
    @Authenticated() user: AuthenticatedPayload,
    @Param('id') id: string,
  ): Promise<void> {
    await this.taskFacade.deleteTaskUseCase.execute({
      id,
      userId: user.id,
      userRole: user.role,
    });
  }
}
