import { FindAllResponse } from 'src/types/common.type';

export interface IBaseRepository<T> {
  create(item: T | any): Promise<T>;

  findOneById(id: string, projection?: string | object, options?: object): Promise<T>;

  findOneByConditions(
    conditions: object, //NOTE: or FilterQuery (mongoose)
    projection?: string | object,
    options?: object, // NOTE: or QueryOption (mongoose)
  ): Promise<T>;

  findAll(
    conditions?: object, // NOTE: optional when getAll
    projection?: string | object,
    options?: object,
  ): Promise<FindAllResponse<T>>;

  update(id: string, data: Partial<T>): Promise<T>;

  softDelete(id: string): Promise<boolean>;

  permanentlyDelete(id: string): Promise<boolean>;
}
