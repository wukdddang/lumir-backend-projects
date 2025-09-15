import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../../../common/enums';

/**
 * 사용자 엔티티
 * 시스템 사용자의 기본 정보와 상태를 관리합니다.
 * 
 * 외부 메타데이터 서버에서 제공되는 정보는 저장하지 않고,
 * CMS 시스템에서만 사용되는 정보만 저장합니다.
 */
@Entity('users')
export class UserEntity {
  /**
   * 사용자 ID (외부 메타데이터 서버의 사원 ID와 동일)
   * 메타데이터 서버에서 제공되는 사원 고유 식별자를 사용
   */
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  /**
   * 사용자 역할
   * 시스템 내에서의 권한과 역할을 정의
   */
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER
  })
  role: Role;

  /**
   * 현재 활성화된 탭
   * 사용자가 마지막으로 접근한 탭들의 정보를 JSON 배열로 저장
   * 사용자 경험 향상을 위한 상태 정보
   */
  @Column({
    type: 'json',
    nullable: true,
    comment: '사용자가 현재 활성화한 탭 목록 (JSON 배열)'
  })
  activeTabs: string[];

  /**
   * 마지막 접속 일시
   * 사용자의 마지막 로그인 시간을 추적
   */
  @Column({
    type: 'datetime',
    nullable: true,
    comment: '마지막 접속 일시'
  })
  lastLoginAt: Date;

  /**
   * 계정 활성화 여부
   * 퇴사자나 비활성화된 계정을 관리하기 위한 플래그
   */
  @Column({
    type: 'boolean',
    default: true,
    comment: '계정 활성화 여부'
  })
  isActive: boolean;

  /**
   * 등록 일시
   * 이 시스템에 사용자가 처음 등록된 시간
   */
  @CreateDateColumn({
    comment: '사용자가 시스템에 등록된 일시'
  })
  createdAt: Date;

  /**
   * 수정 일시
   * 사용자 정보가 마지막으로 업데이트된 시간
   */
  @UpdateDateColumn({
    comment: '사용자 정보가 마지막으로 수정된 일시'
  })
  updatedAt: Date;
}
