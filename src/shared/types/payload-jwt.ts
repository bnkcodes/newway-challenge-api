import { UserRole } from '@prisma/client';

export type AuthenticatedPayload = {
  id: string;
  email: string;
  role: UserRole;
  deletedAt?: Date | null;
  iat: number;
  exp: number;
};
