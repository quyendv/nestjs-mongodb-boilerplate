import { FindAllResponse } from 'src/types/common.type';

export interface Write<T> {
  create(item: T | any): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  remove(id: string): Promise<boolean>;
}

export interface Read<T> {
  findAll(
    filter?: object, // NOTE: optional for getAll. FilterQuery (mongoose)
    projection?: string | object,
    options?: object, // NOTE: QueryOption (mongoose)
  ): Promise<FindAllResponse<T>>;
  findOneById(id: string, projection?: string | object, options?: object): Promise<T>;
  findOneByConditions(
    filter: Partial<T>,
    projection?: string | object,
    options?: object,
  ): Promise<T>;
}

export interface IBaseService<T> extends Write<T>, Read<T> {}
