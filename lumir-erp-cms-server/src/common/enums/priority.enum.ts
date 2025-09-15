/**
 * 우선순위 Enum
 * 공지사항의 중요도를 나타냅니다.
 */
export enum Priority {
  /** 낮음 - 일반적인 공지사항 */
  LOW = 'LOW',
  
  /** 보통 - 일반적인 중요도의 공지사항 */
  MEDIUM = 'MEDIUM',
  
  /** 높음 - 중요한 공지사항 */
  HIGH = 'HIGH',
  
  /** 긴급 - 즉시 확인이 필요한 공지사항 */
  URGENT = 'URGENT'
}
