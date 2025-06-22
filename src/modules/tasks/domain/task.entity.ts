import { TaskStatus } from '@prisma/client';

import { Entity } from '@/shared/domain/entities/entity';

import { TaskRules } from './task.validator';

export type TaskProps = {
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDate: Date;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class TaskEntity extends Entity<TaskProps> {
  get title(): string {
    return this.props.title;
  }

  get description(): string | null {
    return this.props.description;
  }

  get status(): TaskStatus {
    return this.props.status;
  }

  get dueDate(): Date {
    return this.props.dueDate;
  }

  get userId(): string {
    return this.props.userId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  private _updateTimestamp(): void {
    this.props.updatedAt = new Date();
  }

  update(updates: Partial<TaskProps>): void {
    Object.assign(this.props, updates);
    this._updateTimestamp();
  }

  constructor(props: TaskProps, id?: string) {
    TaskEntity._validate(props);
    super(
      {
        ...props,
        status: props.status ?? TaskStatus.PENDING,
        description: props.description ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }

  static _validate(props: TaskProps) {
    TaskRules._validate(props);
  }
}
