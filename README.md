# Boilerplate NestJS

> Tutorial: [Viblo](https://viblo.asia/s/nestjs-thuc-chien-MkNLr3kaVgA)

## Part 1 - Config base

Dotenv

- `npm i --save @nestjs/config`
- `app.module.ts` thêm

  ```ts
  imports: [ConfigModule.forRoot({ isGlobal: true })];
  ```

Husky with formatter & linter (see `LocalNote/Husky-LintStaged-Commitlint.md`)

Validate

- `npm i --save class-validator class-transformer`
- ```ts
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // clear property not in dto class-validator
    }),
  );
  ```

[Path Alias](https://viblo.asia/p/setup-boilerplate-cho-du-an-nestjs-phan-1-team-co-nhieu-thanh-vien-env-joi-husky-commitlint-prettier-dockerizing-EbNVQxG2LvR#_6-path-aliases-28)

## Part 2 - Database with Repository Pattern

Cài đặt package: `npm i @nestjs/mongoose mongoose`

Giải thích cấu trúc folder (xem thêm trong link)

- Repository giống như Interface của Service, có chứa model, các query để tương tác với database. Cũng dùng `@InjectModel(modelName)` để add model
- Entity giống như các schema -> Có thể tách riêng ra thay vì theo series
- Dto là nơi validate dữ liệu

Series Viblo chia theo kiểu có Repository/base và Module/base/, sau đó các model như users, books, ... nằm trong module và implement/extend các base.entity và base.\*.repository. Tuy nhiên ta có thể chia theo /entity, /repository 1 chỗ luôn, và các module chỉ gọi mà dùng thôi cho dễ tìm

Ta chỉ cần làm đến `RepositoryPattern` là đã đủ dùng rồi, phần `ServicePattern` là không cần thiết lắm. Thêm nữa là chỉ cần `BaseAbstractRepository` là đủ rồi, khi dùng chỉ cần extends class đó và thêm các properties/methods cần thiết, không cần tạo 1 `*RepositoryInterface` rồi tạo `*Repository` extends BaseAbstractRepository và implements \*RepositoryInterface nữa, rất mắc công (mặc dù đúng là làm pattern thì nên có interface cho rõ ràng)

Tham khảo thêm với [typeorm repository pattern](https://viblo.asia/p/nestjs-xay-dung-project-tich-hop-typeorm-repository-pattern-Eb85o9VBZ2G)
