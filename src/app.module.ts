import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user.module';
import { BookModule } from './books/book.module';
import { ReadingModule } from './readings/reading.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { LoggingMiddleware } from './common/middlewares/logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    BookModule,
    ReadingModule,
    AuthModule,
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the LoggingMiddleware globally
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}