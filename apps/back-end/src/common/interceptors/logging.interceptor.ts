import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    
    // Ignorar logging para rotas de healthcheck e metrics
    if (url === '/healthz' || url === '/metrics') {
      return next.handle();
    }
    
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const responseTime = Date.now() - now;

        this.logger.log(
          JSON.stringify({
            method,
            url,
            statusCode,
            responseTime: `${responseTime}ms`,
            timestamp: new Date().toISOString(),
          }),
        );
      }),
      catchError((error) => {
        const responseTime = Date.now() - now;
        this.logger.error(
          JSON.stringify({
            method,
            url,
            error: error.message,
            responseTime: `${responseTime}ms`,
            timestamp: new Date().toISOString(),
          }),
        );
        return throwError(() => error);
      }),
    );
  }
}

