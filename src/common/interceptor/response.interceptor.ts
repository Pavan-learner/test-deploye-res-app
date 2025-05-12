  import {
    CallHandler,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import {map, Observable, throwError } from 'rxjs';

  export type Response<T> = {
    status: boolean;
    statusCode: number;
    path: string;
    data: T;
  };

  @Injectable()
  export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {

  // This object contains the version information for the API and the application
    private readonly versionInfo = {
      appVersion: '1.0.0',
      apiVersion: 'v1',
    };

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      
      // this method is used get the object (i.e. request and response) from the execution context
      const httpContext = context.switchToHttp();

      // from the httpContext we are extracting the request and response object 
      const response = httpContext.getResponse();

      return next.handle().pipe(
        map((data) => ({
          statusCode: response.statusCode,
          status: 'success',
          timestamp: new Date().toISOString(),
          version: {
            ...this.versionInfo,
          },
          data : data,
          error: null,
        })),
      );
    }

    // this is not yet confirmed yet 
    errorHandler(exception: HttpException, context: ExecutionContext) {
      const ctx = context.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();

      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      response.status(status).json({
        status: false,
        statusCode: status,
        path: request.url,
        result: exception,
        timestamp: new Date().toISOString(), // Add the missing timestamp property
      });
    }
  }
