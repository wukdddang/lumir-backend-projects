import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

/**
 * 소프트웨어 엔티티
 * 회사에서 사용하는 소프트웨어의 정보와 사용 현황을 관리합니다.
 */
@Entity('softwares')
export class SoftwareEntity {
  /**
   * 소프트웨어 고유 ID
   * 시스템에서 자동 생성되는 소프트웨어 식별자
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 소프트웨어 이름
   */
  @Column({
    type: 'varchar',
    length: 100,
    comment: '소프트웨어 이름'
  })
  name: string;

  /**
   * 소프트웨어 설명
   * 소프트웨어에 대한 상세 설명
   */
  @Column({
    type: 'text',
    nullable: true,
    comment: '소프트웨어 설명'
  })
  description: string;

  /**
   * 소프트웨어 버전
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '소프트웨어 버전'
  })
  version: string;

  /**
   * 소프트웨어 벤더/제조사
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '소프트웨어 제조사'
  })
  vendor: string;

  /**
   * 관리자 ID
   * 이 소프트웨어를 관리하는 담당자 ID
   */
  @Column({
    type: 'varchar',
    length: 50,
    comment: '소프트웨어 관리 담당자 ID'
  })
  managerId: string;

  /**
   * 관리자 정보
   * UserEntity와의 관계 정의
   */
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'managerId' })
  manager: UserEntity;

  /**
   * 라이선스 비용
   * 연간 또는 월간 라이선스 비용
   */
  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
    comment: '소프트웨어 라이선스 비용'
  })
  licenseCost: number;

  /**
   * 비용 주기
   * 비용 지불 주기 (월간, 연간, 일회성 등)
   */
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: '비용 지불 주기 (MONTHLY, YEARLY, ONCE)'
  })
  costCycle: string;

  /**
   * 사용 부서 ID 목록
   * 이 소프트웨어를 사용하는 부서들의 ID
   * 메타데이터 서버에서 부서 정보를 조회할 때 사용
   */
  @Column({
    type: 'json',
    comment: '사용 부서 ID 목록 (JSON 배열)'
  })
  departmentIds: string[];

  /**
   * 총 라이선스 수
   * 구매한 총 라이선스 수량
   */
  @Column({
    type: 'int',
    default: 0,
    comment: '총 라이선스 수'
  })
  totalLicenses: number;

  /**
   * 사용 중인 라이선스 수
   * 현재 활발히 사용되고 있는 라이선스 수
   */
  @Column({
    type: 'int',
    default: 0,
    comment: '현재 사용 중인 라이선스 수'
  })
  usedLicenses: number;

  /**
   * 소프트웨어 상태
   * 활성/비활성 상태
   */
  @Column({
    type: 'boolean',
    default: true,
    comment: '소프트웨어 활성 상태'
  })
  isActive: boolean;

  /**
   * 라이선스 만료일
   * 라이선스가 만료되는 날짜
   */
  @Column({
    type: 'date',
    nullable: true,
    comment: '라이선스 만료일'
  })
  licenseExpiryDate: Date;

  /**
   * 등록 일시
   * 소프트웨어가 시스템에 등록된 시간
   */
  @CreateDateColumn({
    comment: '소프트웨어 등록 일시'
  })
  createdAt: Date;

  /**
   * 수정 일시
   * 소프트웨어 정보가 마지막으로 수정된 시간
   */
  @UpdateDateColumn({
    comment: '소프트웨어 정보 수정 일시'
  })
  updatedAt: Date;
}
