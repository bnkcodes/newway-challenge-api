import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { EnvironmentVariables, EnvironmentVariablesType } from '@/config/env';
import { PrismaService } from '@/shared/infra/prisma/prisma.service';

import { AuthenticatedPayload } from '../types/payload-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(EnvironmentVariables.KEY)
    private readonly config: EnvironmentVariablesType,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
    });
  }

  public async validate(
    payload: AuthenticatedPayload,
  ): Promise<AuthenticatedPayload> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, role: true, deletedAt: true },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (user.deletedAt) {
      throw new Error('Conta desativada');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      deletedAt: user.deletedAt,
      iat: payload.iat,
      exp: payload.exp,
    };
  }
}
