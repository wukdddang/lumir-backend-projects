import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { Role } from '../../common/enums';

/**
 * 사용자 도메인 서비스
 * 사용자 엔티티의 기본적인 CRUD 작업과 도메인 로직을 처리합니다.
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * 사용자 ID로 조회
   * @param id - 사용자 ID
   * @returns 사용자 엔티티 또는 null
   */
  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * 사용자 ID로 조회 (없으면 예외 발생)
   * @param id - 사용자 ID
   * @returns 사용자 엔티티
   * @throws NotFoundException
   */
  async findByIdOrFail(id: string): Promise<UserEntity> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`사용자를 찾을 수 없습니다. ID: ${id}`);
    }
    return user;
  }

  /**
   * 활성화된 모든 사용자 조회
   * @returns 활성 사용자 배열
   */
  async findActiveUsers(): Promise<UserEntity[]> {
    return this.userRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 특정 역할을 가진 사용자들 조회
   * @param role - 조회할 역할
   * @returns 해당 역할을 가진 사용자 배열
   */
  async findUsersByRole(role: Role): Promise<UserEntity[]> {
    return this.userRepository.find({
      where: { 
        role,
        isActive: true 
      },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 새 사용자 생성
   * @param userData - 사용자 생성 데이터
   * @returns 생성된 사용자 엔티티
   */
  async create(userData: {
    id: string;
    role?: Role;
    activeTabs?: string[];
  }): Promise<UserEntity> {
    const user = this.userRepository.create({
      id: userData.id,
      role: userData.role || Role.USER,
      activeTabs: userData.activeTabs || [],
      isActive: true,
    });

    return this.userRepository.save(user);
  }

  /**
   * 사용자 정보 업데이트
   * @param id - 사용자 ID
   * @param updateData - 업데이트할 데이터
   * @returns 업데이트된 사용자 엔티티
   */
  async update(
    id: string,
    updateData: Partial<Pick<UserEntity, 'role' | 'activeTabs' | 'isActive' | 'lastLoginAt'>>
  ): Promise<UserEntity> {
    const user = await this.findByIdOrFail(id);
    
    Object.assign(user, updateData);
    
    return this.userRepository.save(user);
  }

  /**
   * 사용자 활성화된 탭 업데이트
   * @param id - 사용자 ID
   * @param activeTabs - 새로운 활성 탭 배열
   * @returns 업데이트된 사용자 엔티티
   */
  async updateActiveTabs(id: string, activeTabs: string[]): Promise<UserEntity> {
    return this.update(id, { activeTabs });
  }

  /**
   * 사용자 마지막 로그인 시간 업데이트
   * @param id - 사용자 ID
   * @returns 업데이트된 사용자 엔티티
   */
  async updateLastLoginAt(id: string): Promise<UserEntity> {
    return this.update(id, { lastLoginAt: new Date() });
  }

  /**
   * 사용자 비활성화 (퇴사 처리)
   * @param id - 사용자 ID
   * @returns 업데이트된 사용자 엔티티
   */
  async deactivate(id: string): Promise<UserEntity> {
    return this.update(id, { isActive: false });
  }

  /**
   * 비활성 사용자들을 일괄 삭제
   * 퇴사자 정리 작업에 사용
   * @returns 삭제된 사용자 수
   */
  async removeInactiveUsers(): Promise<number> {
    const result = await this.userRepository.delete({ isActive: false });
    return result.affected || 0;
  }

  /**
   * 사용자 존재 여부 확인
   * @param id - 사용자 ID
   * @returns 존재 여부
   */
  async exists(id: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { id } });
    return count > 0;
  }
}
