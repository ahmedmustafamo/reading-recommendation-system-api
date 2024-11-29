import { Controller, Post, Body, Get, Param, Put, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/RoleGuards';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @Post()
  @Roles('admin')
  @UseGuards(RolesGuard)
  async createBook(@Body() createBookDto: CreateBookDto) {
    return this.bookService.createBook(createBookDto);
  }

  @Put(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async updateBook(
    @Param('id') id: number,
    @Body() updateData: Partial<CreateBookDto>) {
    return this.bookService.updateBook(id, updateData);
  }

  @Get()
  @Roles('admin', 'user')
  @UseGuards(RolesGuard)
  async getAllBooks() {
    return this.bookService.getAllBooks();
  }
}
