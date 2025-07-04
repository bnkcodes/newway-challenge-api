import { APP_GUARD } from '@nestjs/core';

import { PrismaService } from '@/shared/infra/prisma/prisma.service';

import { JwtAuthGuard } from '../guards/jwt.guard';
import { RoleGuard } from '../guards/role.guard';
import { JwtStrategy } from '../strategies/jwt.strategy';

export const providers = [
  PrismaService,
  JwtStrategy,
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
  {
    provide: APP_GUARD,
    useClass: RoleGuard,
  },
];
