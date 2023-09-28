import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class BaseResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const response = context.switchToHttp().getResponse();
        return next.handle().pipe(map((data) => {
            const baseResponse = {
                success: data.success,
                message: data.message,
                data: data.result,
                meta: data.meta,
                code: response.statusCode,
                error: data.error,
            }
            return baseResponse;
        }));
    }
}
