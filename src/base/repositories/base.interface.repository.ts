import { FindAllResponse } from 'src/types/common.type';

export interface BaseRepositoryInterface<T> {
  create(dto: T | any): Promise<T>;

  findOneById(id: string, projection?: string | object, options?: object): Promise<T>;

  findOneByConditions(
    conditions?: object,
    projection?: string | object,
    options?: object,
  ): Promise<T>;

  findAll(
    conditions: object,
    projection?: string | object,
    options?: object,
  ): Promise<FindAllResponse<T>>;

  update(id: string, dto: Partial<T>): Promise<T>;

  softDelete(id: string): Promise<boolean>;

  permanentlyDelete(id: string): Promise<boolean>;
}
