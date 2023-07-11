import { Model } from 'mongoose';
import { FindAllResponse } from 'src/types/common.type';
import { BaseEntity } from '../entities/base.entity';
import { BaseRepositoryInterface } from './base.interface.repository';

export abstract class BaseRepositoryAbstract<T extends BaseEntity>
  implements BaseRepositoryInterface<T>
{
  protected constructor(private readonly model: Model<T>) {
    this.model = model;
  }

  async create(dto: T | any): Promise<T> {
    const createdData = await this.model.create(dto); // same new model(...)
    return createdData.save();
  }

  async findOneById(id: string, projection?: string | object, options?: object): Promise<T> {
    const item = await this.model.findById(id, projection, options);
    return item.deletedAt ? null : item;
  }

  async findOneByConditions(
    conditions?: object,
    projection?: string | object,
    options?: object,
  ): Promise<T> {
    return await this.model.findOne({ ...conditions, deletedAt: null }, projection, options); // .exec()
  }

  async findAll(
    conditions: object,
    projection?: string | object,
    options?: object,
  ): Promise<FindAllResponse<T>> {
    const [count, items] = await Promise.all([
      this.model.count({ ...conditions, deletedAt: null }),
      this.model.find({ ...conditions, deletedAt: null }, projection, options),
    ]);

    return { count, items };
  }

  async update(id: string, dto: Partial<T>): Promise<T> {
    // NOTE: Phân biệt 3 cách: update object then save() | updateOne/Many (chỉ trả về thông số đã cập nhật: số lượng, ...) | findOneAndUpdate (trả về document mới/cũ theo {new: true/false}) -> phân biệt xem trong Movie_RS.BE.md

    // const updatedData = await this.model.findOneAndUpdate({ _id: id, deletedAt: null }, dto, { new: true });
    // if (!updatedData) throw error / BadRequestException / NotFoundException
    // FIXME: không return luôn, vì nếu k tìm thấy trả về null và response k gửi đc null -> trống -> xử lý như trên
    return await this.model.findOneAndUpdate({ _id: id, deletedAt: null }, dto, { new: true });
  }

  async softDelete(id: string): Promise<boolean> {
    const deletedData = await this.model.findById(id);
    if (!deletedData) return false;
    return !!(await this.model.findByIdAndUpdate<T>(id, { deletedAt: new Date() }).exec()); // exec()
  }

  async permanentlyDelete(id: string): Promise<boolean> {
    const deletedData = await this.model.findById(id);
    if (!deletedData) return false;
    return await this.model.findByIdAndDelete(id);
  }
}
