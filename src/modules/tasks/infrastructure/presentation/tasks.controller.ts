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
  @Role(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar tarefa' })
  @ApiResponse({ status: 201, type: TaskPresenterWrapper })
  async create(
    @Authenticated() user: any,
    @Body() input: CreateTaskDto,
  ): Promise<TaskPresenterWrapper> {
    const { task } = await this.taskFacade.createTaskUseCase.execute({
      ...input,
      userId: user.id,
    });
    return new TaskPresenterWrapper(TaskPresenter.fromOutput(task));
  }

  @Get()
  @Role(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar tarefas' })
  @ApiResponse({ status: 200, type: TaskCollectionPresenter })
  async list(
    @Authenticated() user: any,
    @Query() queryParams?: CollectionInput,
  ): Promise<TaskCollectionPresenter> {
    const { tasks, totalCount, page, pageSize } =
      await this.taskFacade.listTasksUseCase.execute({
        filter: {
          userId: user.isAdmin ? undefined : user.id,
        },
        page: queryParams?.page || 1,
        pageSize: queryParams?.pageSize || 10,
        sortBy: queryParams?.sortBy ?? 'createdAt',
        sortDirection:
          queryParams?.sortDirection?.toLowerCase() === 'desc' ? 'desc' : 'asc',
      });

    return new TaskCollectionPresenter(
      TaskPresenter.fromMany(tasks),
      totalCount,
      page,
      pageSize,
    );
  }

  @Get(':id')
  @Role(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Buscar tarefa por ID' })
  @ApiResponse({ status: 200, type: TaskPresenterWrapper })
  async get(
    @Authenticated() user: any,
    @Param('id') id: string,
  ): Promise<TaskPresenterWrapper> {
    const { task } = await this.taskFacade.getTaskUseCase.execute({
      id,
      userId: user.isAdmin ? undefined : user.id,
    });
    return new TaskPresenterWrapper(TaskPresenter.fromOutput(task));
  }

  @Put(':id')
  @Role(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar tarefa' })
  @ApiResponse({ status: 200, type: TaskPresenterWrapper })
  async update(
    @Authenticated() user: any,
    @Param('id') id: string,
    @Body() input: UpdateTaskDto,
  ): Promise<TaskPresenterWrapper> {
    const { task } = await this.taskFacade.updateTaskUseCase.execute({
      id,
      userId: user.id,
      ...input,
    });
    return new TaskPresenterWrapper(TaskPresenter.fromOutput(task));
  }

  @Delete(':id')
  @Role(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Deletar tarefa' })
  @ApiResponse({ status: 204 })
  async delete(
    @Authenticated() user: any,
    @Param('id') id: string,
  ): Promise<void> {
    await this.taskFacade.deleteTaskUseCase.execute({
      id,
      userId: user.id,
    });
  }
}
