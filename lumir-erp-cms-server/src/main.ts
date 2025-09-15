import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { BootstrapService } from './common/services/bootstrap.service';

/**
 * 애플리케이션 부트스트랩 함수
 * NestJS 애플리케이션을 초기화하고 시작합니다.
 */
async function bootstrap() {
  // NestJS 애플리케이션 인스턴스 생성
  const app = await NestFactory.create(AppModule);

  // 설정 서비스 가져오기
  const configService = app.get(ConfigService);
  const bootstrapService = app.get(BootstrapService);

  // 전역 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      // 자동 타입 변환 활성화
      transform: true,
      // DTO에 정의되지 않은 속성 제거
      whitelist: true,
      // 허용되지 않은 속성이 있을 때 오류 발생
      forbidNonWhitelisted: true,
      // 상세한 에러 메시지 제공
      disableErrorMessages: false,
    }),
  );

  // 전역 예외 필터 설정
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS 설정
  const corsOrigin = configService.get<string>('CORS_ORIGIN', '*');
  app.enableCors({
    origin: corsOrigin === '*' ? true : corsOrigin.split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // API 전역 프리픽스 설정
  app.setGlobalPrefix('api/v1');

  // Graceful shutdown 설정
  app.enableShutdownHooks();

  // 애플리케이션 정보 로깅
  bootstrapService.logApplicationInfo();

  // 서버 시작
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  console.log(`🚀 서버가 포트 ${port}에서 시작되었습니다.`);
  console.log(`📍 API 문서: http://localhost:${port}/api/v1`);
}

// 애플리케이션 시작
bootstrap().catch((error) => {
  console.error('❌ 애플리케이션 시작 중 오류가 발생했습니다:', error);
  process.exit(1);
});
