export abstract class IPrismaRepository<
  FindFirstArgsBase,
  WhereUniqueInput,
  CreateInput,
  UpdateInput,
  Model,
> {
  abstract findAll(data?: FindFirstArgsBase): Promise<Model[]>;
  abstract findByUnique(unique: WhereUniqueInput): Promise<Model | void>;
  abstract create(data: CreateInput): Promise<Model>;
  abstract update(
    unique: WhereUniqueInput,
    data: UpdateInput,
  ): Promise<Model | void>;
  abstract delete(unique: WhereUniqueInput): Promise<void>;
  abstract count(data?: FindFirstArgsBase): Promise<number>;
}
