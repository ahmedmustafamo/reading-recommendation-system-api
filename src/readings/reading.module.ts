import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingService } from './reading.service';
import { ReadingController } from './reading.controller';
import { Reading } from './reading.entity';
import { Book } from '../books/book.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Reading, Book])],
  providers: [ReadingService, JwtService],
  controllers: [ReadingController],
})
export class ReadingModule {}
