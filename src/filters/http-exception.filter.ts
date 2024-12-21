import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = null;
    status = exception instanceof HttpException && exception.getStatus();
    status = status ? status : exception.name === 'ValidationError' ? 403 : 500;
    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.message || 'Internal server error';

    //console.log('exception: ', typeof exception);
    //console.log('http exception??: ', exception instanceof HttpException);
    //const proto = Object.getPrototypeOf(exception);
    //console.log('proto: ', proto);
    const stringError = JSON.stringify(exception);
    console.log('exceptionResponse: ', exception);
    console.log('stringError: ', stringError);
    const error =
      typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as object);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...error,
    });
  }
}
