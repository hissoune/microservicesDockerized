import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { LogtailService } from "./logtail/logtail.service";


export class LogginInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const logtailService = new LogtailService();

    logtailService.info(`Request: ${request.method} ${request.url}`, {
      body: request.body,
      headers: request.headers,
    });

    return next.handle().pipe(
      tap((data) => {
        logtailService.info(`Response: ${response.statusCode}`, {
          body: data,
        });
      }),
    );
  }
}