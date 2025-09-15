# 사내 CMS 백엔드 서버

NestJS 기반의 사내 Content Management System 백엔드 서버입니다.

## 🏗️ 아키텍처

Clean Architecture 기반으로 구성되어 있습니다:

```
src/
├── domains/          # 도메인 계층 (엔티티, 도메인 서비스)
├── business/         # 비즈니스 계층 (UseCase, 비즈니스 로직)
├── contexts/         # 컨텍스트 계층 (복합 서비스, 외부 연동)
├── interfaces/       # 인터페이스 계층 (컨트롤러, DTO)
└── common/           # 공통 유틸리티 (가드, 필터, 설정)
```

## 🚀 주요 기능

1. **관리자 공지사항 관리**
   - 공지사항 작성, 수정, 삭제
   - 대상 역할별 공지사항 표시
   - 우선순위 및 게시 기간 관리

2. **사용자 정보 저장**
   - 탭 위치 정보 저장
   - 사용자 역할 관리
   - 로그인 이력 추적

3. **회사 소프트웨어 사용 현황**
   - 소프트웨어 라이선스 관리
   - 사용량 모니터링
   - 비용 계산 및 분석

## 🔐 인증 시스템

- **SSO 통합**: 외부 SSO 서버에서 발급한 JWT 토큰 검증
- **메타데이터 연동**: 외부 메타데이터 서버에서 직원/부서 정보 조회
- **역할 기반 권한**: Role-based Access Control (RBAC)
- **자동 동기화**: 주기적으로 퇴사자 정보 동기화

## 🛠️ 기술 스택

- **Framework**: NestJS
- **Database**: MySQL + TypeORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator, class-transformer
- **Configuration**: @nestjs/config
- **Architecture**: Clean Architecture

## 📦 설치 및 실행

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경 변수 설정
```bash
cp env.example .env
```

`.env` 파일을 열어서 실제 환경에 맞는 값들을 설정해주세요:

```env
# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=lumir_cms_db

# JWT 설정
JWT_SECRET=your-secure-secret-key

# SSO 서버 설정
SSO_SERVER_URL=https://your-sso-server.com
SSO_CLIENT_ID=your_client_id
SSO_CLIENT_SECRET=your_client_secret

# 메타데이터 서버 설정
METADATA_SERVER_URL=https://your-metadata-server.com
METADATA_API_KEY=your_api_key
```

### 3. 데이터베이스 설정
MySQL 데이터베이스를 생성하고 연결 정보를 환경 변수에 설정하세요.

### 4. 애플리케이션 실행

#### 개발 모드
```bash
npm run start:dev
```

#### 프로덕션 모드
```bash
npm run build
npm run start:prod
```

## 🌐 API 엔드포인트

애플리케이션은 기본적으로 `http://localhost:3000/api/v1` 에서 실행됩니다.

### 인증 관련
- `POST /api/v1/auth/login` - 로그인 (SSO 토큰 검증)
- `GET /api/v1/auth/profile` - 현재 사용자 정보 조회

### 공지사항 관련
- `GET /api/v1/notices` - 공지사항 목록 조회
- `GET /api/v1/notices/:id` - 공지사항 상세 조회
- `POST /api/v1/admin/notices` - 공지사항 작성 (관리자)
- `PUT /api/v1/admin/notices/:id` - 공지사항 수정 (관리자)
- `DELETE /api/v1/admin/notices/:id` - 공지사항 삭제 (관리자)

### 소프트웨어 관리 관련
- `GET /api/v1/software` - 소프트웨어 목록 조회
- `GET /api/v1/software/:id` - 소프트웨어 상세 조회
- `POST /api/v1/admin/software` - 소프트웨어 등록 (관리자)
- `PUT /api/v1/admin/software/:id` - 소프트웨어 수정 (관리자)

## 🔧 스크립트

```bash
# 개발 서버 시작
npm run start:dev

# 빌드
npm run build

# 프로덕션 서버 시작
npm run start:prod

# 테스트
npm run test

# 테스트 (watch 모드)
npm run test:watch

# E2E 테스트
npm run test:e2e

# 코드 포맷팅
npm run format

# 린팅
npm run lint
```

## 📁 프로젝트 구조

```
src/
├── domains/                    # 도메인 계층
│   ├── user/                   # 사용자 도메인
│   │   ├── entities/           # 사용자 엔티티
│   │   ├── user.service.ts     # 사용자 도메인 서비스
│   │   └── user.module.ts      # 사용자 모듈
│   ├── notice/                 # 공지사항 도메인
│   └── software/               # 소프트웨어 도메인
├── business/                   # 비즈니스 계층
│   ├── auth/                   # 인증 비즈니스
│   ├── user/                   # 사용자 비즈니스
│   └── notice/                 # 공지사항 비즈니스
├── contexts/                   # 컨텍스트 계층
│   └── user-sync/              # 사용자 동기화
├── interfaces/                 # 인터페이스 계층
│   └── web/                    # 웹 인터페이스
│       ├── admin/              # 관리자 API
│       ├── user/               # 사용자 API
│       └── common/             # 공통 API
└── common/                     # 공통 계층
    ├── guards/                 # 가드 (인증, 인가)
    ├── decorators/             # 커스텀 데코레이터
    ├── filters/                # 예외 필터
    ├── modules/                # 설정 모듈
    ├── services/               # 공통 서비스
    ├── interfaces/             # 공통 인터페이스
    └── enums/                  # 열거형
```

## 🔒 보안

- JWT 토큰 기반 인증
- 역할 기반 접근 제어 (RBAC)
- CORS 설정
- 입력값 검증 및 sanitization
- SQL injection 방지 (TypeORM 사용)

## 🤝 기여

1. 이 저장소를 Fork 합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/새기능`)
3. 변경사항을 커밋합니다 (`git commit -am '새로운 기능 추가'`)
4. 브랜치에 Push 합니다 (`git push origin feature/새기능`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 사내 전용입니다.
