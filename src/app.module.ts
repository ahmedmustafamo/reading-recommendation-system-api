import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { BookModule } from './books/book.module';
import { ReadingModule } from './readings/reading.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    UserModule,
    BookModule,
    ReadingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}