import { registerAs } from '@nestjs/config';

/**
 * 애플리케이션 설정
 * 환경 변수를 구조화된 설정 객체로 변환합니다.
 */
export default registerAs('app', () => ({
  // 서버 설정
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // CORS 설정
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // 로깅 설정
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // JWT 설정
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  
  // SSO 서버 설정
  sso: {
    serverUrl: process.env.SSO_SERVER_URL,
    clientId: process.env.SSO_CLIENT_ID,
    clientSecret: process.env.SSO_CLIENT_SECRET,
  },
  
  // 메타데이터 서버 설정
  metadata: {
    serverUrl: process.env.METADATA_SERVER_URL,
    apiKey: process.env.METADATA_API_KEY,
  },
  
  // 동기화 설정
  sync: {
    intervalMinutes: parseInt(process.env.SYNC_INTERVAL_MINUTES, 10) || 60,
  },
}));
