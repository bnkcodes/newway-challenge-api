import { Injectable } from '@nestjs/common';

import { IPrismaRepository } from '@/shared/infra/repositories/base.repository.interface';

import { PrismaService } from './prisma.service';

@Injectable()
export abstract class PrismaRepository<
  FindFirstArgsBase,
  WhereUniqueInput,
  CreateInput,
  UpdateInput,
  Model,
> implements
    IPrismaRepository<
      FindFirstArgsBase,
      WhereUniqueInput,
      CreateInput,
      UpdateInput,
      Model
    >
{
  private table: string;
  private prisma: PrismaService;

  constructor(table: string, prisma: PrismaService) {
    this.table = table;
    this.prisma = prisma;
  }

  async findAll(data?: FindFirstArgsBase): Promise<Model[]> {
    return await this.prisma[this.table].findMany(data);
  }

  async findByUnique(where: WhereUniqueInput): Promise<Model | void> {
    return await this.prisma[this.table].findUnique({ where });
  }

  async create(data: CreateInput): Promise<Model> {
    return await this.prisma[this.table].create({ data });
  }

  async update(
    where: WhereUniqueInput,
    data: UpdateInput,
  ): Promise<Model | void> {
    return await this.prisma[this.table].update({ where, data });
  }

  async delete(where: WhereUniqueInput): Promise<void> {
    await this.prisma[this.table].delete({ where });
  }

  async count(data?: FindFirstArgsBase): Promise<number> {
    return await this.prisma[this.table].count(data);
  }
}
