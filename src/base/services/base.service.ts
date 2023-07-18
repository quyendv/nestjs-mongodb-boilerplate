import { FindAllResponse } from 'src/types/common.type';
import { BaseEntity } from '../entities/base.entity';
import { BaseRepository } from '../repositories/base.repository';
import { IBaseService } from './i.base.service';

export class BaseService<T extends BaseEntity, R extends BaseRepository<T>>
  implements IBaseService<T>
{
  constructor(private readonly repository: R) {} // NOTE: R | BaseRepository<T>, nhưng R là class con cụ thể hơn -> nên dùng hơn; // NOTE: khai báo private/projected readonly là đang lấy tham số và gán this (dependency injection), nếu để protected thì class con có thể gọi đến repository -> nhưng ta muốn ẩn repository và chỉ quan tâm nó có chức năng gì đã build sẵn (dựa trên repository ẩn này) chứ không được gọi trực tiếp -> nếu cần thì tạo thêm ở class con
  // FIXME: Cách khác có vẻ gọn hơn là để repository là protected readonly, như vậy khi *Repository extends lại BaseRepository sẽ gọi this.repository để tạo thêm method riêng mà không cần tạo thêm pvr userRepository/notRepository/... riêng

  create(item: T | any): Promise<T> {
    return this.repository.create(item); // NOTE: Không cần async/await here, repository method đã là async rồi
  }

  update(id: string, data: Partial<T>): Promise<T> {
    return this.repository.update(id, data);
  }

  remove(id: string): Promise<boolean> {
    return this.repository.softDelete(id); // NOTE: default softDel
  }

  findAll(
    filter?: object, // NOTE: optional for getAll. FilterQuery (mongoose)
    projection?: string | object,
    options?: object, // NOTE: QueryOption (mongoose)
  ): Promise<FindAllResponse<T>> {
    return this.repository.findAll(filter, projection, options);
  }

  findOneById(id: string, projection?: string | object, options?: object): Promise<T> {
    return this.repository.findOneById(id, projection, options);
  }

  findOneByConditions(
    filter: Partial<T>,
    projection?: string | object,
    options?: object,
  ): Promise<T> {
    return this.repository.findOneByConditions(filter, projection, options);
  }
}
