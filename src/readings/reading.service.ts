import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reading } from './reading.entity';
import { CreateReadingIntervalDto } from './dto/create-reading-interval.dto';
import { Book } from '../books/book.entity';

@Injectable()
export class ReadingService {
  constructor(
    @InjectRepository(Reading)
    private readonly readingRepository: Repository<Reading>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  // Create a reading interval
  async createReadingInterval(createReadingIntervalDto: CreateReadingIntervalDto): Promise<Reading> {
    const { user_id, book_id, start_page, end_page } = createReadingIntervalDto;

    // Find the book
    const book = await this.bookRepository.findOne({
        where: { id: book_id }
    });
    if (!book) {
      throw new BadRequestException('Book not found');
    }

    // Create the reading interval
    const reading = this.readingRepository.create({
      user: { id: user_id }, // Assuming we have the user with the user_id
      book,
      start_page,
      end_page,
    });

    return this.readingRepository.save(reading);
  }

  // Calculate the unique pages read for a book
  async getTopBooks(page: number, limit: number): Promise<any[]> {
    const offset = (page - 1) * limit;

    const query = `
      SELECT 
        book_id, 
        book_name, 
        num_of_pages, 
        SUM(LEAST(end_page, num_of_pages) - start_page + 1) AS num_of_read_pages 
      FROM 
        readings
      JOIN 
        books ON readings.book_id = books.id
      GROUP BY 
        book_id, book_name, num_of_pages
      ORDER BY 
        num_of_read_pages DESC
      LIMIT $1 OFFSET $2;
    `;

    return await this.readingRepository.query(query, [limit, offset]);
  }
}
