import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// 공통 모듈들
import { ConfigModule } from './common/modules/config.module';
import { DatabaseModule } from './common/modules/database.module';

// 도메인 모듈
import { UserModule } from './domains/user/user.module';

// 가드
import { JwtGuard } from './common/guards/jwt.guard';
import { RolesGuard } from './common/guards/roles.guard';

// 서비스
import { BootstrapService } from './common/services/bootstrap.service';

/**
 * 애플리케이션 루트 모듈
 * 모든 모듈과 글로벌 설정을 관리합니다.
 */
@Module({
  imports: [
    // 전역 설정 모듈 (환경 변수, 설정)
    ConfigModule,
    
    // 데이터베이스 모듈
    DatabaseModule,
    
    // JWT 모듈 설정
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d'),
        },
      }),
      global: true,
    }),
    
    // 도메인 모듈들
    UserModule,
    
    // TODO: 추후 추가할 모듈들
    // NoticeModule,
    // SoftwareModule,
    // BusinessModule,
    // ContextModule,
    // WebModule,
  ],
  providers: [
    // 부트스트랩 서비스
    BootstrapService,
    
    // 전역 가드 설정
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
