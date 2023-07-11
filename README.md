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
