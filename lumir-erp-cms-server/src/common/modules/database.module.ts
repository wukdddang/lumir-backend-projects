import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity, NoticeEntity, SoftwareEntity } from '../../domains';

/**
 * 데이터베이스 모듈
 * TypeORM 설정과 엔티티 등록을 관리합니다.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        
        // 엔티티 등록
        entities: [UserEntity, NoticeEntity, SoftwareEntity],
        
        // 개발 환경에서만 자동 동기화
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        logging: configService.get<string>('NODE_ENV') === 'development',
        
        // 연결 풀 설정
        extra: {
          connectionLimit: 10,
        },
        
        // 타임존 및 문자셋 설정
        timezone: '+09:00',
        charset: 'utf8mb4',
      }),
    }),
  ],
})
export class DatabaseModule {}
