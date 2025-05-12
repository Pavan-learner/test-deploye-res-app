import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor2 implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Directly return data without nesting it
        return {
          appVersion: '1.0.0', // Optional dynamic version if needed
          date: new Date().toISOString(),
          error: null,
          data, // The actual data from the response is directly here, not nested
          timestamp: Date.now(),
        };
      }),
      catchError((error) => {
        let errorResponse;

        if (error instanceof HttpException) {
          errorResponse = {
            appVersion: '1.0.0',
            date: new Date().toISOString(),
            error: {
              message: error.message,
              statusCode: error.getStatus(),
            },
            data: null, // Error response returns null for data
            timestamp: Date.now(),
          };
        } else {
          errorResponse = {
            appVersion: '1.0.0',
            date: new Date().toISOString(),
            error: {
              message: 'An unexpected error occurred.',
            },
            data: null, // Error response returns null for data
            timestamp: Date.now(),
          };
        }

        return throwError(() => errorResponse);
      }),
    );
  }
}