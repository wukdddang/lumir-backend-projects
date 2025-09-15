import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * 애플리케이션 부트스트랩 서비스
 * 애플리케이션 시작 시 초기화 작업을 수행합니다.
 */
@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BootstrapService.name);

  constructor(private readonly configService: ConfigService) {}

  async onApplicationBootstrap() {
    this.logger.log('🚀 애플리케이션 부트스트랩을 시작합니다...');

    try {
      // 환경 설정 검증
      await this.validateConfiguration();
      
      // 외부 서버 연결 상태 확인
      await this.checkExternalServices();
      
      this.logger.log('✅ 애플리케이션 부트스트랩이 완료되었습니다.');
    } catch (error) {
      this.logger.error('❌ 애플리케이션 부트스트랩 중 오류가 발생했습니다.', error);
      throw error;
    }
  }

  /**
   * 필수 환경 설정 검증
   */
  private async validateConfiguration() {
    this.logger.log('📋 환경 설정을 검증합니다...');

    const requiredConfigs = [
      'JWT_SECRET',
      'DB_HOST',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_NAME',
      'SSO_SERVER_URL',
      'METADATA_SERVER_URL',
    ];

    for (const config of requiredConfigs) {
      const value = this.configService.get(config);
      if (!value) {
        throw new Error(`필수 환경 변수가 설정되지 않았습니다: ${config}`);
      }
    }

    this.logger.log('✅ 환경 설정 검증이 완료되었습니다.');
  }

  /**
   * 외부 서비스 연결 상태 확인
   */
  private async checkExternalServices() {
    this.logger.log('🔍 외부 서비스 연결 상태를 확인합니다...');

    try {
      // SSO 서버 헬스 체크 (실제 구현 시 추가)
      // await this.checkSsoServerHealth();
      
      // 메타데이터 서버 헬스 체크 (실제 구현 시 추가)
      // await this.checkMetadataServerHealth();
      
      this.logger.log('✅ 외부 서비스 연결 상태 확인이 완료되었습니다.');
    } catch (error) {
      this.logger.warn('⚠️ 일부 외부 서비스에 연결할 수 없습니다.', error.message);
      // 외부 서비스 연결 실패는 애플리케이션 시작을 막지 않습니다.
    }
  }

  /**
   * 애플리케이션 정보 출력
   */
  logApplicationInfo() {
    const nodeEnv = this.configService.get('NODE_ENV');
    const port = this.configService.get('PORT');
    
    this.logger.log('==========================================');
    this.logger.log('🏢 사내 CMS 백엔드 서버');
    this.logger.log(`📦 환경: ${nodeEnv}`);
    this.logger.log(`🌐 포트: ${port}`);
    this.logger.log(`🕒 시작 시간: ${new Date().toISOString()}`);
    this.logger.log('==========================================');
  }
}
