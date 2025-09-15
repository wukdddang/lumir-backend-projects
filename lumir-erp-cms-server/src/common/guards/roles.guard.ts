import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * 역할 기반 인가 가드
 * 사용자의 역할을 확인하여 접근 권한을 제어합니다.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // @Roles() 데코레이터로 지정된 필요 역할 목록 가져오기
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 역할 제한이 없는 경우 접근 허용
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // 사용자 정보가 없는 경우 접근 거부
    if (!user) {
      return false;
    }

    // 사용자가 필요한 역할 중 하나라도 가지고 있는지 확인
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
