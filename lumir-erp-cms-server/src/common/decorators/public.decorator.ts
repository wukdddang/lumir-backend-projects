import { SetMetadata } from '@nestjs/common';

/**
 * Public 데코레이터 키
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Public 데코레이터
 * 이 데코레이터가 적용된 컨트롤러나 핸들러는 JWT 인증을 생략합니다.
 * 
 * @example
 * ```typescript
 * @Public()
 * @Get('/health')
 * healthCheck() {
 *   return { status: 'ok' };
 * }
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
