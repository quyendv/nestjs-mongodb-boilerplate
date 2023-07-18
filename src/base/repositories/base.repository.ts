import { Model } from 'mongoose';
import { FindAllResponse } from 'src/types/common.type';
import { BaseEntity } from '../entities/base.entity';
import { IBaseRepository } from './i.base.repository';

export abstract class BaseRepository<T extends BaseEntity> implements IBaseRepository<T> {
  constructor(private readonly model: Model<T>) {} // NOTE: khai báo private/projected readonly là đang lấy tham số và gán this (dependency injection), nếu để protected thì class con có thể gọi đến model -> nhưng ta muốn ẩn model và chỉ quan tâm nó có chức năng gì đã build sẵn (dựa trên model) chứ không được gọi model -> nếu cần thì tạo thêm ở class con
  // FIXME: Cách khác có vẻ gọn hơn là để model là protected readonly, như vậy khi *Repository extends lại BaseRepository sẽ gọi this.repository để tạo thêm method riêng mà không cần tạo thêm pvr userRepository/notRepository/... riêng

  async create(item: T | any): Promise<T> {
    const createdData = await this.model.create(item); // same new model(...)
    return createdData.save();
  }

  async findOneById(id: string, projection?: string | object, options?: object): Promise<T> {
    const item = await this.model.findById(id, projection, options);
    return item.deletedAt ? null : item;
  }

  async findOneByConditions(
    conditions: object, //NOTE: or FilterQuery (mongoose)
    projection?: string | object,
    options?: object, // NOTE: or QueryOption (mongoose)
  ): Promise<T> {
    return await this.model.findOne({ ...conditions, deletedAt: null }, projection, options); // .exec()
  }

  async findAll(
    conditions?: object, // NOTE: optional when getAll
    projection?: string | object,
    options?: object,
  ): Promise<FindAllResponse<T>> {
    const [count, items] = await Promise.all([
      this.model.count({ ...conditions, deletedAt: null }),
      this.model.find({ ...conditions, deletedAt: null }, projection, options),
    ]);

    return { count, items };
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    // NOTE: Phân biệt 3 cách: update object then save() | updateOne/Many (chỉ trả về thông số đã cập nhật: số lượng, ...) | findOneAndUpdate (trả về document mới/cũ theo {new: true/false}) -> phân biệt xem trong Movie_RS.BE.md

    // const updatedData = await this.model.findOneAndUpdate({ _id: id, deletedAt: null }, dto, { new: true });
    // if (!updatedData) throw error / BadRequestException / NotFoundException

    return await this.model.findOneAndUpdate({ _id: id, deletedAt: null }, data, { new: true }); // FIXME: không return luôn, vì nếu k tìm thấy trả về null và response k gửi đc null -> trống -> xử lý như trên
  }

  async softDelete(id: string): Promise<boolean> {
    const deletedData = await this.model.findById(id);
    if (!deletedData) return false;
    return !!(await this.model.findByIdAndUpdate<T>(id, { deletedAt: new Date() })); // exec()
  }

  async permanentlyDelete(id: string): Promise<boolean> {
    const deletedData = await this.model.findById(id);
    if (!deletedData) return false;
    return await this.model.findByIdAndDelete(id);
  }
}
