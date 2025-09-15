/**
 * 환경 변수 검증 함수
 * 애플리케이션 시작 시 필수 환경 변수들의 유효성을 검사합니다.
 */
export function validateEnvironmentVariables(config: Record<string, unknown>) {
  const requiredVars = [
    'JWT_SECRET',
    'DB_USERNAME', 
    'DB_PASSWORD',
    'DB_NAME',
    'SSO_SERVER_URL',
    'SSO_CLIENT_ID',
    'SSO_CLIENT_SECRET',
    'METADATA_SERVER_URL',
    'METADATA_API_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !config[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `필수 환경 변수가 설정되지 않았습니다: ${missingVars.join(', ')}`
    );
  }

  // JWT_SECRET 길이 검증
  if (typeof config.JWT_SECRET === 'string' && config.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET은 최소 32자 이상이어야 합니다.');
  }

  // 포트 번호 검증
  const port = config.PORT ? Number(config.PORT) : 3000;
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error('PORT는 1-65535 범위의 유효한 숫자여야 합니다.');
  }

  // DB 포트 번호 검증
  const dbPort = config.DB_PORT ? Number(config.DB_PORT) : 3306;
  if (isNaN(dbPort) || dbPort < 1 || dbPort > 65535) {
    throw new Error('DB_PORT는 1-65535 범위의 유효한 숫자여야 합니다.');
  }

  return {
    ...config,
    PORT: port,
    DB_PORT: dbPort,
    NODE_ENV: config.NODE_ENV || 'development',
    LOG_LEVEL: config.LOG_LEVEL || 'info',
    JWT_EXPIRES_IN: config.JWT_EXPIRES_IN || '1d',
    CORS_ORIGIN: config.CORS_ORIGIN || '*',
    SYNC_INTERVAL_MINUTES: config.SYNC_INTERVAL_MINUTES ? Number(config.SYNC_INTERVAL_MINUTES) : 60,
    DB_HOST: config.DB_HOST || 'localhost',
  };
}
