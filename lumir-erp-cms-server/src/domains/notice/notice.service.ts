import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Between } from 'typeorm';
import { NoticeEntity } from './entities/notice.entity';
import { NoticeState, Priority, Role } from '../../common/enums';

/**
 * 공지사항 도메인 서비스
 * 공지사항 엔티티의 기본적인 CRUD 작업과 도메인 로직을 처리합니다.
 */
@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(NoticeEntity)
    private readonly noticeRepository: Repository<NoticeEntity>,
  ) {}

  /**
   * 공지사항 ID로 조회
   * @param id - 공지사항 ID
   * @returns 공지사항 엔티티 또는 null
   */
  async findById(id: string): Promise<NoticeEntity | null> {
    return this.noticeRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  /**
   * 공지사항 ID로 조회 (없으면 예외 발생)
   * @param id - 공지사항 ID
   * @returns 공지사항 엔티티
   * @throws NotFoundException
   */
  async findByIdOrFail(id: string): Promise<NoticeEntity> {
    const notice = await this.findById(id);
    if (!notice) {
      throw new NotFoundException(`공지사항을 찾을 수 없습니다. ID: ${id}`);
    }
    return notice;
  }

  /**
   * 특정 역할에 대한 활성 공지사항 조회
   * @param userRole - 사용자 역할
   * @param options - 조회 옵션
   * @returns 공지사항 배열
   */
  async findActiveNoticesForRole(
    userRole: Role,
    options: {
      limit?: number;
      offset?: number;
      priorityFilter?: Priority;
    } = {}
  ): Promise<NoticeEntity[]> {
    const now = new Date();
    const queryBuilder = this.noticeRepository
      .createQueryBuilder('notice')
      .leftJoinAndSelect('notice.author', 'author')
      .where('notice.state = :state', { state: NoticeState.PUBLISHED })
      .andWhere('notice.publishStartAt <= :now', { now })
      .andWhere('(notice.publishEndAt IS NULL OR notice.publishEndAt >= :now)', { now })
      .andWhere('JSON_CONTAINS(notice.targetRoles, :userRole)', { 
        userRole: JSON.stringify(userRole) 
      });

    // 우선순위 필터
    if (options.priorityFilter) {
      queryBuilder.andWhere('notice.priority = :priority', { 
        priority: options.priorityFilter 
      });
    }

    // 정렬: 고정 공지사항 먼저, 그 다음 우선순위, 마지막으로 생성일
    queryBuilder.orderBy('notice.isPinned', 'DESC')
      .addOrderBy('notice.priority', 'DESC')
      .addOrderBy('notice.createdAt', 'DESC');

    // 페이징
    if (options.limit) {
      queryBuilder.limit(options.limit);
    }
    if (options.offset) {
      queryBuilder.offset(options.offset);
    }

    return queryBuilder.getMany();
  }

  /**
   * 관리자용 공지사항 목록 조회 (모든 상태)
   * @param options - 조회 옵션
   * @returns 공지사항 배열
   */
  async findAllForAdmin(options: {
    limit?: number;
    offset?: number;
    state?: NoticeState;
    authorId?: string;
  } = {}): Promise<NoticeEntity[]> {
    const queryOptions: FindManyOptions<NoticeEntity> = {
      relations: ['author'],
      order: {
        isPinned: 'DESC',
        priority: 'DESC',
        createdAt: 'DESC',
      },
    };

    // 필터 조건
    const where: any = {};
    if (options.state) {
      where.state = options.state;
    }
    if (options.authorId) {
      where.authorId = options.authorId;
    }

    if (Object.keys(where).length > 0) {
      queryOptions.where = where;
    }

    // 페이징
    if (options.limit) {
      queryOptions.take = options.limit;
    }
    if (options.offset) {
      queryOptions.skip = options.offset;
    }

    return this.noticeRepository.find(queryOptions);
  }

  /**
   * 새 공지사항 생성
   * @param noticeData - 공지사항 생성 데이터
   * @returns 생성된 공지사항 엔티티
   */
  async create(noticeData: {
    title: string;
    description: string;
    authorId: string;
    targetRoles: Role[];
    publishStartAt: Date;
    publishEndAt?: Date;
    priority?: Priority;
    isPinned?: boolean;
  }): Promise<NoticeEntity> {
    const notice = this.noticeRepository.create({
      ...noticeData,
      state: NoticeState.DRAFT,
      priority: noticeData.priority || Priority.MEDIUM,
      isPinned: noticeData.isPinned || false,
      viewCount: 0,
    });

    return this.noticeRepository.save(notice);
  }

  /**
   * 공지사항 업데이트
   * @param id - 공지사항 ID
   * @param updateData - 업데이트할 데이터
   * @returns 업데이트된 공지사항 엔티티
   */
  async update(
    id: string,
    updateData: Partial<Pick<
      NoticeEntity,
      'title' | 'description' | 'targetRoles' | 'publishStartAt' | 'publishEndAt' | 
      'priority' | 'isPinned' | 'state'
    >>
  ): Promise<NoticeEntity> {
    const notice = await this.findByIdOrFail(id);
    
    Object.assign(notice, updateData);
    
    return this.noticeRepository.save(notice);
  }

  /**
   * 공지사항 게시
   * @param id - 공지사항 ID
   * @returns 업데이트된 공지사항 엔티티
   */
  async publish(id: string): Promise<NoticeEntity> {
    return this.update(id, { state: NoticeState.PUBLISHED });
  }

  /**
   * 공지사항 숨김
   * @param id - 공지사항 ID
   * @returns 업데이트된 공지사항 엔티티
   */
  async hide(id: string): Promise<NoticeEntity> {
    return this.update(id, { state: NoticeState.HIDDEN });
  }

  /**
   * 공지사항 만료
   * @param id - 공지사항 ID
   * @returns 업데이트된 공지사항 엔티티
   */
  async expire(id: string): Promise<NoticeEntity> {
    return this.update(id, { state: NoticeState.EXPIRED });
  }

  /**
   * 공지사항 조회수 증가
   * @param id - 공지사항 ID
   * @returns 업데이트된 공지사항 엔티티
   */
  async incrementViewCount(id: string): Promise<NoticeEntity> {
    const notice = await this.findByIdOrFail(id);
    notice.viewCount += 1;
    return this.noticeRepository.save(notice);
  }

  /**
   * 만료된 공지사항 자동 처리
   * @returns 처리된 공지사항 수
   */
  async processExpiredNotices(): Promise<number> {
    const now = new Date();
    const result = await this.noticeRepository.update(
      {
        state: NoticeState.PUBLISHED,
        publishEndAt: Between(new Date(0), now),
      },
      {
        state: NoticeState.EXPIRED,
      }
    );

    return result.affected || 0;
  }

  /**
   * 공지사항 삭제
   * @param id - 공지사항 ID
   */
  async delete(id: string): Promise<void> {
    const notice = await this.findByIdOrFail(id);
    await this.noticeRepository.remove(notice);
  }

  /**
   * 공지사항 개수 조회
   * @param filters - 필터 조건
   * @returns 공지사항 개수
   */
  async count(filters: {
    state?: NoticeState;
    authorId?: string;
    userRole?: Role;
  } = {}): Promise<number> {
    const queryBuilder = this.noticeRepository.createQueryBuilder('notice');

    if (filters.state) {
      queryBuilder.andWhere('notice.state = :state', { state: filters.state });
    }

    if (filters.authorId) {
      queryBuilder.andWhere('notice.authorId = :authorId', { authorId: filters.authorId });
    }

    if (filters.userRole) {
      const now = new Date();
      queryBuilder
        .andWhere('notice.state = :publishedState', { publishedState: NoticeState.PUBLISHED })
        .andWhere('notice.publishStartAt <= :now', { now })
        .andWhere('(notice.publishEndAt IS NULL OR notice.publishEndAt >= :now)', { now })
        .andWhere('JSON_CONTAINS(notice.targetRoles, :userRole)', { 
          userRole: JSON.stringify(filters.userRole) 
        });
    }

    return queryBuilder.getCount();
  }
}
