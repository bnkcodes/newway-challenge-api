import { TaskStatus } from '@prisma/client';

import { ApiProperty } from '@nestjs/swagger';

import { TaskOutput } from '../../application/dtos/task.output';

export class TaskPresenter {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description: string | null;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromOutput(output: TaskOutput): TaskPresenter {
    return {
      id: output.id,
      title: output.title,
      description: output.description,
      status: output.status,
      dueDate: output.dueDate,
      userId: output.userId,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
    };
  }

  static fromMany(outputs: TaskOutput[]): TaskPresenter[] {
    return outputs.map((output) => this.fromOutput(output));
  }
}

export class TaskPresenterWrapper {
  @ApiProperty()
  task: TaskPresenter;

  constructor(task: TaskPresenter) {
    this.task = task;
  }
}

export class TaskCollectionPresenter {
  @ApiProperty({ type: [TaskPresenter] })
  tasks: TaskPresenter[];

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  constructor(
    tasks: TaskPresenter[],
    totalCount: number,
    page: number,
    pageSize: number,
  ) {
    this.tasks = tasks;
    this.totalCount = totalCount;
    this.page = page;
    this.pageSize = pageSize;
  }
}
