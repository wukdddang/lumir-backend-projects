import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 현재 사용자 정보 인터페이스
 * JWT 토큰에서 추출된 사용자 정보를 나타냅니다.
 */
export interface CurrentUserInfo {
  /** 사용자 ID (사원 ID) */
  id: string;
  /** 이메일 주소 */
  email: string;
  /** 사용자 이름 */
  name: string;
  /** 부서 ID */
  departmentId: string;
  /** 사용자 역할 목록 */
  roles: string[];
}

/**
 * CurrentUser 데코레이터
 * 현재 인증된 사용자의 정보를 파라미터로 주입합니다.
 * JWT 가드를 통해 추출된 사용자 정보를 제공합니다.
 * 
 * @example
 * ```typescript
 * @Get('/profile')
 * getProfile(@CurrentUser() user: CurrentUserInfo) {
 *   return { userId: user.id, name: user.name };
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserInfo => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
