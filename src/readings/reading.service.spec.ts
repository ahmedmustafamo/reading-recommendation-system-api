import { Test, TestingModule } from '@nestjs/testing';
import { ReadingService } from './reading.service';
import { Reading } from './reading.entity';
import { Book } from '../books/book.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { CreateReadingIntervalDto } from './dto/create-reading-interval.dto';
import { User } from 'src/users/user.entity';

describe('ReadingService', () => {
  let service: ReadingService;
  let readingRepository: Repository<Reading>;
  let bookRepository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReadingService,
        {
          provide: getRepositoryToken(Reading),
          useClass: Repository, // Mocking Repository
        },
        {
          provide: getRepositoryToken(Book),
          useClass: Repository, // Mocking Repository
        },
      ],
    }).compile();

    service = module.get<ReadingService>(ReadingService);
    readingRepository = module.get<Repository<Reading>>(getRepositoryToken(Reading));
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  describe('createReadingInterval', () => {
    it('should create a reading interval successfully', async () => {
      const createReadingIntervalDto: CreateReadingIntervalDto = {
        user_id: 1,
        book_id: 1,
        start_page: 1,
        end_page: 100,
      };

      const book = new Book();
      book.id = 1;
      book.book_name = 'Test Book';
      book.num_of_pages = 200;

      // Mocking bookRepository.findOne to return a valid book
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(book);

      // Mocking readingRepository.save to return the saved reading
      const savedReading = new Reading();
      savedReading.id = 1;
      savedReading.user = { id: 1 } as User; // Mock user object
      savedReading.book = book;
      savedReading.start_page = 1;
      savedReading.end_page = 100;

      jest.spyOn(readingRepository, 'create').mockImplementationOnce(() => savedReading);
      jest.spyOn(readingRepository, 'save').mockResolvedValue(savedReading);

      // Act
      const result = await service.createReadingInterval(createReadingIntervalDto);

      // Assert
      expect(result).toEqual(savedReading);
      expect(readingRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        user: { id: 1 },
        book,
        start_page: 1,
        end_page: 100,
      }));
    });

    it('should throw BadRequestException when book is not found', async () => {
      const createReadingIntervalDto: CreateReadingIntervalDto = {
        user_id: 1,
        book_id: 1,
        start_page: 1,
        end_page: 100,
      };

      // Mocking bookRepository.findOne to return null (book not found)
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.createReadingInterval(createReadingIntervalDto))
        .rejects
        .toThrowError(new BadRequestException('Book not found'));
    });
  });

  describe('getTopBooks', () => {
    it('should return top books with the correct data', async () => {
      const topBooksData = [
        {
          book_id: 1,
          book_name: 'Test Book',
          num_of_pages: 200,
          num_of_read_pages: 150,
        },
      ];

      // Mocking readingRepository.query to return top books data
      jest.spyOn(readingRepository, 'query').mockResolvedValue(topBooksData);

      const result = await service.getTopBooks(1, 10);

      expect(result).toEqual(topBooksData);
      expect(readingRepository.query).toHaveBeenCalledWith(expect.any(String), [10, 0]);
    });

    it('should return an empty array when no books are found', async () => {
      // Mocking readingRepository.query to return empty array
      jest.spyOn(readingRepository, 'query').mockResolvedValue([]);

      const result = await service.getTopBooks(1, 10);

      expect(result).toEqual([]);
    });
  });
});
