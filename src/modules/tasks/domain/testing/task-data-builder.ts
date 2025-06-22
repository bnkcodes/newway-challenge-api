import { TaskStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

import { TaskProps } from '../task.entity';

type Props = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: Date;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export function TaskDataBuilder(props: Props): TaskProps {
  return {
    title: props.title ?? faker.lorem.sentence(),
    description: props.description ?? faker.lorem.paragraph(),
    status: props.status ?? TaskStatus.PENDING,
    dueDate: props.dueDate ?? faker.date.future(),
    userId: props.userId ?? faker.string.uuid(),
    createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt ?? new Date(),
  };
}
