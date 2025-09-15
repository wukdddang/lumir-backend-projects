import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { SoftwareEntity } from './entities/software.entity';

/**
 * 소프트웨어 도메인 서비스
 * 소프트웨어 엔티티의 기본적인 CRUD 작업과 도메인 로직을 처리합니다.
 */
@Injectable()
export class SoftwareService {
  constructor(
    @InjectRepository(SoftwareEntity)
    private readonly softwareRepository: Repository<SoftwareEntity>,
  ) {}

  /**
   * 소프트웨어 ID로 조회
   * @param id - 소프트웨어 ID
   * @returns 소프트웨어 엔티티 또는 null
   */
  async findById(id: string): Promise<SoftwareEntity | null> {
    return this.softwareRepository.findOne({
      where: { id },
      relations: ['manager'],
    });
  }

  /**
   * 소프트웨어 ID로 조회 (없으면 예외 발생)
   * @param id - 소프트웨어 ID
   * @returns 소프트웨어 엔티티
   * @throws NotFoundException
   */
  async findByIdOrFail(id: string): Promise<SoftwareEntity> {
    const software = await this.findById(id);
    if (!software) {
      throw new NotFoundException(`소프트웨어를 찾을 수 없습니다. ID: ${id}`);
    }
    return software;
  }

  /**
   * 활성화된 모든 소프트웨어 조회
   * @param options - 조회 옵션
   * @returns 소프트웨어 배열
   */
  async findActive(options: {
    limit?: number;
    offset?: number;
    managerId?: string;
  } = {}): Promise<SoftwareEntity[]> {
    const queryOptions: FindManyOptions<SoftwareEntity> = {
      where: { isActive: true },
      relations: ['manager'],
      order: { createdAt: 'DESC' },
    };

    // 관리자 필터
    if (options.managerId) {
      queryOptions.where = { 
        ...queryOptions.where as any, 
        managerId: options.managerId 
      };
    }

    // 페이징
    if (options.limit) {
      queryOptions.take = options.limit;
    }
    if (options.offset) {
      queryOptions.skip = options.offset;
    }

    return this.softwareRepository.find(queryOptions);
  }

  /**
   * 특정 부서에서 사용하는 소프트웨어 조회
   * @param departmentId - 부서 ID
   * @returns 해당 부서에서 사용하는 소프트웨어 배열
   */
  async findByDepartment(departmentId: string): Promise<SoftwareEntity[]> {
    return this.softwareRepository
      .createQueryBuilder('software')
      .leftJoinAndSelect('software.manager', 'manager')
      .where('software.isActive = :isActive', { isActive: true })
      .andWhere('JSON_CONTAINS(software.departmentIds, :departmentId)', { 
        departmentId: JSON.stringify(departmentId) 
      })
      .orderBy('software.name', 'ASC')
      .getMany();
  }

  /**
   * 특정 관리자가 담당하는 소프트웨어 조회
   * @param managerId - 관리자 ID
   * @returns 해당 관리자가 담당하는 소프트웨어 배열
   */
  async findByManager(managerId: string): Promise<SoftwareEntity[]> {
    return this.softwareRepository.find({
      where: { 
        managerId,
        isActive: true 
      },
      relations: ['manager'],
      order: { name: 'ASC' },
    });
  }

  /**
   * 라이선스 부족한 소프트웨어 조회
   * @param threshold - 임계값 (사용률 백분율, 기본값 90%)
   * @returns 라이선스 부족한 소프트웨어 배열
   */
  async findLowLicenseAvailability(threshold: number = 90): Promise<SoftwareEntity[]> {
    return this.softwareRepository
      .createQueryBuilder('software')
      .leftJoinAndSelect('software.manager', 'manager')
      .where('software.isActive = :isActive', { isActive: true })
      .andWhere('software.totalLicenses > 0')
      .andWhere(
        '(software.usedLicenses / software.totalLicenses * 100) >= :threshold', 
        { threshold }
      )
      .orderBy('(software.usedLicenses / software.totalLicenses)', 'DESC')
      .getMany();
  }

  /**
   * 라이선스 만료 예정 소프트웨어 조회
   * @param daysAhead - 며칠 후까지 조회할지 (기본값 30일)
   * @returns 라이선스 만료 예정 소프트웨어 배열
   */
  async findExpiringLicenses(daysAhead: number = 30): Promise<SoftwareEntity[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return this.softwareRepository.find({
      where: {
        isActive: true,
        licenseExpiryDate: futureDate, // TypeORM의 LessThanOrEqual 사용하려면 import 필요
      },
      relations: ['manager'],
      order: { licenseExpiryDate: 'ASC' },
    });
  }

  /**
   * 새 소프트웨어 생성
   * @param softwareData - 소프트웨어 생성 데이터
   * @returns 생성된 소프트웨어 엔티티
   */
  async create(softwareData: {
    name: string;
    description?: string;
    version?: string;
    vendor?: string;
    managerId: string;
    licenseCost?: number;
    costCycle?: string;
    departmentIds: string[];
    totalLicenses?: number;
    licenseExpiryDate?: Date;
  }): Promise<SoftwareEntity> {
    const software = this.softwareRepository.create({
      ...softwareData,
      usedLicenses: 0,
      isActive: true,
    });

    return this.softwareRepository.save(software);
  }

  /**
   * 소프트웨어 정보 업데이트
   * @param id - 소프트웨어 ID
   * @param updateData - 업데이트할 데이터
   * @returns 업데이트된 소프트웨어 엔티티
   */
  async update(
    id: string,
    updateData: Partial<Pick<
      SoftwareEntity,
      'name' | 'description' | 'version' | 'vendor' | 'managerId' | 'licenseCost' | 
      'costCycle' | 'departmentIds' | 'totalLicenses' | 'usedLicenses' | 
      'licenseExpiryDate' | 'isActive'
    >>
  ): Promise<SoftwareEntity> {
    const software = await this.findByIdOrFail(id);
    
    Object.assign(software, updateData);
    
    return this.softwareRepository.save(software);
  }

  /**
   * 라이선스 사용량 업데이트
   * @param id - 소프트웨어 ID
   * @param usedLicenses - 사용 중인 라이선스 수
   * @returns 업데이트된 소프트웨어 엔티티
   */
  async updateLicenseUsage(id: string, usedLicenses: number): Promise<SoftwareEntity> {
    const software = await this.findByIdOrFail(id);
    
    // 사용량이 총 라이선스 수를 초과하지 않도록 제한
    if (usedLicenses > software.totalLicenses) {
      throw new Error(
        `사용 라이선스 수(${usedLicenses})가 총 라이선스 수(${software.totalLicenses})를 초과할 수 없습니다.`
      );
    }

    return this.update(id, { usedLicenses });
  }

  /**
   * 소프트웨어 비활성화
   * @param id - 소프트웨어 ID
   * @returns 업데이트된 소프트웨어 엔티티
   */
  async deactivate(id: string): Promise<SoftwareEntity> {
    return this.update(id, { isActive: false });
  }

  /**
   * 소프트웨어 삭제
   * @param id - 소프트웨어 ID
   */
  async delete(id: string): Promise<void> {
    const software = await this.findByIdOrFail(id);
    await this.softwareRepository.remove(software);
  }

  /**
   * 총 라이선스 비용 계산
   * @param costCycle - 비용 주기 필터 (선택사항)
   * @returns 총 비용 정보
   */
  async calculateTotalCosts(costCycle?: string): Promise<{
    totalCost: number;
    monthlyEstimate: number;
    yearlyEstimate: number;
    softwareCount: number;
  }> {
    const queryBuilder = this.softwareRepository
      .createQueryBuilder('software')
      .select('SUM(software.licenseCost)', 'totalCost')
      .addSelect('COUNT(software.id)', 'softwareCount')
      .addSelect('software.costCycle', 'costCycle')
      .where('software.isActive = :isActive', { isActive: true })
      .andWhere('software.licenseCost IS NOT NULL');

    if (costCycle) {
      queryBuilder.andWhere('software.costCycle = :costCycle', { costCycle });
    }

    queryBuilder.groupBy('software.costCycle');

    const results = await queryBuilder.getRawMany();
    
    let totalCost = 0;
    let monthlyEstimate = 0;
    let yearlyEstimate = 0;
    let softwareCount = 0;

    for (const result of results) {
      const cost = parseFloat(result.totalCost) || 0;
      const count = parseInt(result.softwareCount) || 0;
      
      totalCost += cost;
      softwareCount += count;

      // 월간/연간 추정치 계산
      switch (result.costCycle) {
        case 'MONTHLY':
          monthlyEstimate += cost;
          yearlyEstimate += cost * 12;
          break;
        case 'YEARLY':
          monthlyEstimate += cost / 12;
          yearlyEstimate += cost;
          break;
        case 'ONCE':
          // 일회성 비용은 연간 추정치에만 포함 (분할 상각)
          yearlyEstimate += cost / 3; // 3년 분할 상각으로 가정
          break;
      }
    }

    return {
      totalCost,
      monthlyEstimate,
      yearlyEstimate,
      softwareCount,
    };
  }
}
