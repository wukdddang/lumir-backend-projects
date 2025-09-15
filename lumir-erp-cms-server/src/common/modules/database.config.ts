import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * 데이터베이스 설정
 * TypeORM 연결 설정을 환경 변수로부터 구성합니다.
 */
export default registerAs('database', (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  
  // 엔티티 설정
  entities: [__dirname + '/../../domains/**/*.entity{.ts,.js}'],
  
  // 마이그레이션 설정
  migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  
  // 개발 환경 설정
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  
  // 연결 풀 설정
  extra: {
    connectionLimit: 10,
  },
  
  // 타임존 설정
  timezone: '+09:00',
  
  // 문자셋 설정
  charset: 'utf8mb4',
}));
