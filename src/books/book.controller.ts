import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @Post()
  async createBook(@Body() createBookDto: CreateBookDto) {
    return this.bookService.createBook(createBookDto);
  }

  @Put(':id')
  async updateBook(
    @Param('id') id: number,
    @Body() updateData: Partial<CreateBookDto>) {
    return this.bookService.updateBook(id, updateData);
  }

  @Get()
  async getAllBooks() {
    return this.bookService.getAllBooks();
  }
}
