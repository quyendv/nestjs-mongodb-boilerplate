import { ClassSerializerInterceptor, PlainLiteralObject, Type } from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { Document } from 'mongoose';

// https://viblo.asia/p/setup-boilerplate-cho-du-an-nestjs-phan-3-request-validation-voi-class-validator-va-response-serialization-voi-class-transformer-AZoJjXROVY7#_22-cach-su-dung-10
export default function MongooseClassSerializerInterceptor(
  classToIntercept: Type,
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    private changePlainObjectToClass(document: PlainLiteralObject) {
      if (!(document instanceof Document)) {
        return document;
      }
      return plainToClass(classToIntercept, document.toJSON(), { excludePrefixes: ['_'] }); // NOTE: loại bỏ _id, _... trước khi chuyển sang instance của class - Nên dùng plainToInstance thay thế plainToClass (ở đây là validate từ request sang Dto nên là toClass)
    }

    private prepareResponse(
      response:
        | PlainLiteralObject
        | PlainLiteralObject[]
        | { items: PlainLiteralObject[]; count: number },
    ) {
      if (!Array.isArray(response) && response?.items) {
        const items = this.prepareResponse(response.items);
        return {
          count: response.count,
          items,
        };
      }

      if (Array.isArray(response)) {
        return response.map(this.changePlainObjectToClass);
      }

      return this.changePlainObjectToClass(response);
    }

    serialize(response: PlainLiteralObject | PlainLiteralObject[], options: ClassTransformOptions) {
      return super.serialize(this.prepareResponse(response), options);
    }
  };
}
