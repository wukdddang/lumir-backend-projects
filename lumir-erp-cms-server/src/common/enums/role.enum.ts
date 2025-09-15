/**
 * 사용자 역할 Enum
 * 시스템 내에서 사용자의 권한과 역할을 정의합니다.
 */
export enum Role {
  /** 시스템 관리자 - 모든 권한을 가진 최고 관리자 */
  ADMIN = 'ADMIN',
  
  /** 공지사항 관리자 - 공지사항 작성 및 관리 권한 */
  NOTICE_MANAGER = 'NOTICE_MANAGER',
  
  /** 소프트웨어 관리자 - 회사 소프트웨어 사용 현황 관리 권한 */
  SOFTWARE_MANAGER = 'SOFTWARE_MANAGER',
  
  /** 부서 관리자 - 해당 부서 관련 권한 */
  DEPARTMENT_MANAGER = 'DEPARTMENT_MANAGER',
  
  /** 일반 사용자 - 기본 사용 권한 */
  USER = 'USER'
}
