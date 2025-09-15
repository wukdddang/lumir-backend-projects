/**
 * 공지사항 상태 Enum
 * 공지사항의 현재 상태를 나타냅니다.
 */
export enum NoticeState {
  /** 임시저장 - 작성 중인 상태 */
  DRAFT = 'DRAFT',
  
  /** 게시 - 활성화된 공지사항 */
  PUBLISHED = 'PUBLISHED',
  
  /** 종료 - 게시 기간이 만료되거나 수동으로 종료된 상태 */
  EXPIRED = 'EXPIRED',
  
  /** 숨김 - 관리자에 의해 숨겨진 상태 */
  HIDDEN = 'HIDDEN'
}
