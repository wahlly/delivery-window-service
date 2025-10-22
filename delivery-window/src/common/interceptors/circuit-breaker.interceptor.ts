import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { catchError, Observable, tap, throwError, timeout } from "rxjs"


interface CircuitState {
      failures: number
      lastFailureTime: number | null
      open: boolean
}

@Injectable()
export class CircuitBreakerInterceptor implements NestInterceptor {
      private readonly failureThreshold = 3     //trip after 3 consecutive failures
      private readonly resetTimeout = 10000     // try afain after 10s
      private state: CircuitState = {failures: 0, lastFailureTime: null, open: false}

      intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
            //if circuit is open, check if we can half-open after reset timeout
            if(this.state.open) {
                  const now = Date.now()
                  if(
                        this.state.lastFailureTime &&
                        now - this.state.lastFailureTime > this.resetTimeout
                  ) {
                        //try once again i.e half-open state
                        this.state.open = false
                        this.state.failures = 0
                  } else{
                        return throwError(() =>  new Error('Circuit breaker open - skipping request'))
                  }
            }

            return next.handle().pipe(
                  timeout(3000), //to prevent hanging
                  tap(() => {
                        //if success, reset failures
                        this.state.failures = 0
                        this.state.open = false
                  }),
                  catchError((err) => {
                        this.state.failures++
                        this.state.lastFailureTime = Date.now()

                        if(this.state.failures >= this.failureThreshold) {
                              this.state.open = true;
                              console.warn("circuit breaker opened")
                        }

                        return throwError(() => err)
                  })
            )
      }
}