import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

/**
 * 사용자 도메인 모듈
 * 사용자 엔티티와 관련된 도메인 로직을 관리합니다.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
