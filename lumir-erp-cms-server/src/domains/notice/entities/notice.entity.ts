import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { NoticeState, Priority, Role } from '../../../common/enums';
import { UserEntity } from '../../user/entities/user.entity';

/**
 * 공지사항 엔티티
 * 관리자가 작성하는 공지사항 정보를 관리합니다.
 */
@Entity('notices')
export class NoticeEntity {
  /**
   * 공지사항 고유 ID
   * 시스템에서 자동 생성되는 공지사항 식별자
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 공지사항 제목
   */
  @Column({
    type: 'varchar',
    length: 200,
    comment: '공지사항 제목'
  })
  title: string;

  /**
   * 공지사항 내용
   * 상세한 공지 내용을 저장
   */
  @Column({
    type: 'text',
    comment: '공지사항 상세 내용'
  })
  description: string;

  /**
   * 작성자 ID
   * 공지사항을 작성한 사용자의 ID (외래키)
   */
  @Column({
    type: 'varchar',
    length: 50,
    comment: '작성자 사용자 ID'
  })
  authorId: string;

  /**
   * 작성자 정보
   * UserEntity와의 관계 정의
   */
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  /**
   * 공지 대상 역할
   * 이 공지사항을 볼 수 있는 사용자 역할들
   */
  @Column({
    type: 'json',
    comment: '공지사항 대상 역할 목록 (JSON 배열)'
  })
  targetRoles: Role[];

  /**
   * 게시 시작 일시
   * 공지사항이 사용자에게 표시되기 시작하는 시간
   */
  @Column({
    type: 'datetime',
    comment: '게시 시작 일시'
  })
  publishStartAt: Date;

  /**
   * 게시 종료 일시
   * 공지사항이 사용자에게 표시되는 마지막 시간
   */
  @Column({
    type: 'datetime',
    nullable: true,
    comment: '게시 종료 일시 (null이면 무제한)'
  })
  publishEndAt: Date;

  /**
   * 공지사항 상태
   * 현재 공지사항의 상태 (임시저장, 게시, 종료, 숨김)
   */
  @Column({
    type: 'enum',
    enum: NoticeState,
    default: NoticeState.DRAFT,
    comment: '공지사항 현재 상태'
  })
  state: NoticeState;

  /**
   * 우선순위
   * 공지사항의 중요도
   */
  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.MEDIUM,
    comment: '공지사항 우선순위'
  })
  priority: Priority;

  /**
   * 고정 공지 여부
   * 목록 상단에 고정 표시할지 여부
   */
  @Column({
    type: 'boolean',
    default: false,
    comment: '상단 고정 공지사항 여부'
  })
  isPinned: boolean;

  /**
   * 조회수
   * 공지사항이 조회된 횟수
   */
  @Column({
    type: 'int',
    default: 0,
    comment: '공지사항 조회 수'
  })
  viewCount: number;

  /**
   * 등록 일시
   * 공지사항이 시스템에 등록된 시간
   */
  @CreateDateColumn({
    comment: '공지사항 등록 일시'
  })
  createdAt: Date;

  /**
   * 수정 일시
   * 공지사항이 마지막으로 수정된 시간
   */
  @UpdateDateColumn({
    comment: '공지사항 수정 일시'
  })
  updatedAt: Date;
}
