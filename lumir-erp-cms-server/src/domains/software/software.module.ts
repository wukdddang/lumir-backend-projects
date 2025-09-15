import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoftwareEntity } from './entities/software.entity';
import { SoftwareService } from './software.service';

/**
 * 소프트웨어 도메인 모듈
 * 소프트웨어 엔티티와 관련된 도메인 로직을 관리합니다.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([SoftwareEntity]),
  ],
  providers: [SoftwareService],
  exports: [SoftwareService, TypeOrmModule],
})
export class SoftwareModule {}
