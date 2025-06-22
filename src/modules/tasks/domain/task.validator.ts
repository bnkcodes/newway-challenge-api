import { IsDate, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields';

import { TaskProps } from './task.entity';

export class TaskRules {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  description: string;

  @IsDate()
  @IsNotEmpty()
  dueDate: Date;

  @IsString()
  @IsNotEmpty()
  userId: string;

  constructor(data: TaskProps) {
    Object.assign(this, data);
  }

  static _validate(data: TaskProps): void {
    const validator = new TaskValidator();
    if (!validator.validate(data)) {
      throw new Error('Task validation failed');
    }
  }
}

export class TaskValidator extends ClassValidatorFields<TaskRules> {
  validate(data: TaskProps): boolean {
    return super.validate(new TaskRules(data));
  }
}

export default class TaskValidatorFactory {
  static create(): TaskValidator {
    return new TaskValidator();
  }
}
