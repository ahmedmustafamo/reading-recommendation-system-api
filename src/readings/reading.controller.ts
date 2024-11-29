import { Controller, Post, Body, Get, UseGuards, Query } from '@nestjs/common';
import { ReadingService } from './reading.service';
import { CreateReadingIntervalDto } from './dto/create-reading-interval.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/RoleGuards';

@Controller('readings')
export class ReadingController {
  constructor(private readonly readingService: ReadingService) {}

  // Endpoint to create a reading interval
  @Post()
  @Roles('admin', 'user')
  @UseGuards(RolesGuard)
  async createReadingInterval(
    @Body() createReadingIntervalDto: CreateReadingIntervalDto,
  ) {
    return this.readingService.createReadingInterval(createReadingIntervalDto);
  }

  // Endpoint to get the top 5 books based on the number of pages read
  @Get('top-books')
  @Roles('admin', 'user')
  @UseGuards(RolesGuard)
  async getTopBooks(
    @Query('page') page = 1,
    @Query('limit') limit = 5
  ) {
    return this.readingService.getTopBooks(page, limit);
  }
}
