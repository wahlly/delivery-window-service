import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { CircuitBreakerInterceptor } from './common/interceptors/circuit-breaker.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new CircuitBreakerInterceptor())
  const port = process.env.PORT ?? 6000
  await app.listen(port);
  Logger.log(`application is running on port:${port}`)
}
bootstrap();
