import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * HTTP 예외 필터
 * 애플리케이션에서 발생하는 모든 HTTP 예외를 처리합니다.
 * 일관된 에러 응답 형식과 로깅을 제공합니다.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // 예외 메시지 추출
    const exceptionResponse = exception.getResponse();
    const message = typeof exceptionResponse === 'string' 
      ? exceptionResponse 
      : (exceptionResponse as any).message || '알 수 없는 오류가 발생했습니다.';

    // 에러 응답 객체 구성
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: Array.isArray(message) ? message : [message],
      error: HttpStatus[status] || 'Unknown Error',
    };

    // 개발 환경에서만 스택 트레이스 포함
    if (process.env.NODE_ENV === 'development') {
      (errorResponse as any).stack = exception.stack;
    }

    // 에러 로깅
    this.logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(errorResponse),
      HttpExceptionFilter.name,
    );

    // 클라이언트에 에러 응답 전송
    response.status(status).json(errorResponse);
  }
}
