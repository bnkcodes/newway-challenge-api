import { Entity } from '@/shared/domain/entities/entity';
import { InMemoryRepository } from '@/shared/domain/repositories/in-memory-repository';

interface TestEntityProps {
  props1: number;
}

class TestEntity extends Entity<TestEntityProps> {
  get props1() {
    return this.props.props1;
  }

  set props1(newProps1: number) {
    this.props.props1 = newProps1;
  }
}

class TestRepository extends InMemoryRepository<
  TestEntity,
  TestEntityProps,
  TestEntityProps
> {}

describe('InMemoryRepository', () => {
  let repository: TestRepository;
  let props: TestEntityProps;

  beforeEach(() => {
    repository = new TestRepository();
    props = {
      props1: 1,
    };
  });

  describe('create', () => {
    it('Shoud create entity with Id and put it on memory list', async () => {
      const entity = new TestEntity(props);

      await repository.create(entity);

      expect(repository.items).toHaveLength(1);
      expect(repository.items[0].id).toBeDefined();
    });
  });

  describe('findById', () => {
    it('should find an entity by its id', async () => {
      const entity1 = new TestEntity(props, '1');
      const entity2 = new TestEntity(props, '2');

      await repository.create(entity1);
      await repository.create(entity2);

      const foundEntity = await repository.findById('1');

      expect(foundEntity).toStrictEqual(entity1);
    });
  });

  describe('findOne', () => {
    it('Should find single entity by field', async () => {
      const entity = new TestEntity(props);
      const entity2 = new TestEntity({
        props1: 2,
      });

      await repository.create(entity);
      await repository.create(entity2);

      const findOneResult = await repository.findOne({ props1: 1 });

      expect(findOneResult).toStrictEqual(entity);
    });
  });

  describe('findMany', () => {
    it('Should find many entities by field', async () => {
      const entity = new TestEntity(props);
      const entity2 = new TestEntity(props);
      const entity3 = new TestEntity({
        props1: 4,
      });

      await repository.create(entity);
      await repository.create(entity2);
      await repository.create(entity3);

      const findManyResult = await repository.findMany(props, {
        pageSize: 2,
        page: 1,
      });

      expect(findManyResult.items).toHaveLength(2);
      expect(findManyResult.totalCount).toEqual(2);
      expect(findManyResult.items).toStrictEqual([entity, entity2]);
    });

    it('Should be able to paginate all entities', async () => {
      const entity = new TestEntity({
        props1: 1,
      });
      const entity2 = new TestEntity({
        props1: 2,
      });
      const entity3 = new TestEntity({
        props1: 3,
      });

      await repository.create(entity);
      await repository.create(entity2);
      await repository.create(entity3);

      const findManyResult = await repository.findMany(undefined, {
        pageSize: 1,
        page: 1,
      });

      expect(findManyResult.items).toHaveLength(1);
      expect(findManyResult.totalCount).toEqual(3);
      expect(findManyResult.items).toStrictEqual([entity]);
    });

    it('Should find all entities if dont pass paging', async () => {
      const entity = new TestEntity({
        props1: 1,
      });
      const entity2 = new TestEntity({
        props1: 2,
      });
      const entity3 = new TestEntity({
        props1: 3,
      });

      await repository.create(entity);
      await repository.create(entity2);
      await repository.create(entity3);

      const findManyResult = await repository.findMany();

      expect(findManyResult.items).toHaveLength(3);
      expect(findManyResult.totalCount).toEqual(3);
      expect(findManyResult.items).toStrictEqual([entity, entity2, entity3]);
    });
  });

  describe('update', () => {
    it('should update a existing entity', async () => {
      const entity = new TestEntity(props);

      await repository.create(entity);

      expect(repository.items).toHaveLength(1);
      expect(repository.items[0].id).toBeDefined();

      entity.props1 = 2;

      await repository.update(entity);

      expect(repository.items).toHaveLength(1);
      expect(repository.items[0].props1).toEqual(2);
    });

    it('should not update any entity if searched entity does not exist', async () => {
      const entity = new TestEntity(props);

      entity.props1 = 2;

      await repository.update(entity);

      expect(repository.items).toHaveLength(0);
      expect(repository.items[0]).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete a existing entity', async () => {
      const entity = new TestEntity(props);

      const result = await repository.create(entity);

      expect(repository.items).toHaveLength(1);
      expect(result.id).toBeDefined();

      await repository.delete({ id: result.id });

      expect(repository.items).toHaveLength(0);
    });
  });
});
