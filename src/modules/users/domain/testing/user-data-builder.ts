import { UserRole } from '@prisma/client';
import { faker } from '@faker-js/faker';

import { UserProps } from '@/users/domain/user.entity';

export function UserDataBuilder(props: Partial<UserProps>): UserProps {
  return {
    name: props.name ?? String(faker.person.fullName()),
    email: props.email ?? String(faker.internet.email()).toLowerCase(),
    password: props.password ?? String(faker.internet.password()),
    phone: props.phone ?? null,
    imageUrl: props.imageUrl ?? null,
    role: props.role ?? UserRole.USER,
    createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt ?? new Date(),
    deletedAt: props.deletedAt ?? null,
  };
}
