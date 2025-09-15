import { Module, Global } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import databaseConfig from './database.config';
import { validateEnvironmentVariables } from './env-validation.schema';

/**
 * 전역 설정 모듈
 * 환경 변수 로딩과 검증을 담당합니다.
 * @Global 데코레이터로 전역에서 사용 가능합니다.
 */
@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      validate: validateEnvironmentVariables,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
      ],
      cache: true,
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
