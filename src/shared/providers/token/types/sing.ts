import { UserRole } from '@prisma/client';

export type SingInput = {
  jwtSecret: string;
  jwtExpiresIn: any;
  id?: string;
  email: string;
  name: string;
  role?: UserRole;
  isAdmin?: boolean;
};

export type SingOutput = string;
