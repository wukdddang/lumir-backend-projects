import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeEntity } from './entities/notice.entity';
import { NoticeService } from './notice.service';

/**
 * 공지사항 도메인 모듈
 * 공지사항 엔티티와 관련된 도메인 로직을 관리합니다.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([NoticeEntity]),
  ],
  providers: [NoticeService],
  exports: [NoticeService, TypeOrmModule],
})
export class NoticeModule {}
