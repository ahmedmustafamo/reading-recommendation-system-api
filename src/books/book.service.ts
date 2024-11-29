import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create(createBookDto);
    return this.bookRepository.save(book);
  }

  async updateBook(id: number, updateData: Partial<Book>): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book)
      throw new BadRequestException('Book not found');

    Object.assign(book, updateData);
    return this.bookRepository.save(book);
  }

  async getAllBooks(): Promise<any[]> {
    return this.bookRepository.find()
  }
}
