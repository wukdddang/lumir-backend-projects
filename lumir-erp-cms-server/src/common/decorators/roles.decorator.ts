import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums';

/**
 * Roles 데코레이터 키
 */
export const ROLES_KEY = 'roles';

/**
 * Roles 데코레이터
 * 특정 역할을 가진 사용자만 접근할 수 있도록 제한합니다.
 * 
 * @param roles - 접근을 허용할 역할들
 * 
 * @example
 * ```typescript
 * @Roles(Role.ADMIN, Role.NOTICE_MANAGER)
 * @Post('/notices')
 * createNotice() {
 *   // 관리자 또는 공지사항 관리자만 접근 가능
 * }
 * ```
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
