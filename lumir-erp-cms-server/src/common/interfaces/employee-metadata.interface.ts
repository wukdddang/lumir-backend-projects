/**
 * 외부 메타데이터 서버의 직원 정보 인터페이스
 * 메타데이터 서버 API에서 반환되는 직원 정보 구조입니다.
 */
export interface EmployeeMetadata {
  /** 직원 고유 ID */
  id: string;
  
  /** 직원 이름 */
  name: string;
  
  /** 이메일 주소 */
  email: string;
  
  /** 직무/직책 */
  position: string;
  
  /** 부서 ID */
  departmentId: string;
  
  /** 부서명 */
  departmentName: string;
  
  /** 직원 상태 (재직, 휴직, 퇴사 등) */
  status: 'ACTIVE' | 'INACTIVE' | 'RESIGNED';
  
  /** 입사일 */
  hireDate: string;
  
  /** 퇴사일 (퇴사한 경우) */
  resignationDate?: string;
  
  /** 전화번호 */
  phoneNumber?: string;
  
  /** 사무실 위치 */
  officeLocation?: string;
}

/**
 * 외부 메타데이터 서버의 부서 정보 인터페이스
 * 메타데이터 서버 API에서 반환되는 부서 정보 구조입니다.
 */
export interface DepartmentMetadata {
  /** 부서 고유 ID */
  id: string;
  
  /** 부서명 */
  name: string;
  
  /** 부서 코드 */
  code: string;
  
  /** 상위 부서 ID */
  parentDepartmentId?: string;
  
  /** 부서 관리자 직원 ID */
  managerId?: string;
  
  /** 부서 설명 */
  description?: string;
  
  /** 부서 상태 */
  status: 'ACTIVE' | 'INACTIVE';
  
  /** 생성일 */
  createdAt: string;
  
  /** 수정일 */
  updatedAt: string;
}

/**
 * 메타데이터 서버 API 응답 인터페이스
 * 페이징 정보를 포함한 표준 응답 형식입니다.
 */
export interface MetadataApiResponse<T> {
  /** 응답 데이터 */
  data: T[];
  
  /** 페이징 정보 */
  pagination: {
    /** 현재 페이지 */
    currentPage: number;
    /** 총 페이지 수 */
    totalPages: number;
    /** 페이지당 항목 수 */
    pageSize: number;
    /** 총 항목 수 */
    totalItems: number;
  };
  
  /** 응답 메타 정보 */
  meta: {
    /** 요청 처리 시간 (ms) */
    processingTime: number;
    /** 응답 타임스탬프 */
    timestamp: string;
  };
}
