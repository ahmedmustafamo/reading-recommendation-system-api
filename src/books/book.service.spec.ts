import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { BadRequestException } from '@nestjs/common';

describe('BookService', () => {
    let service: BookService;
    let bookRepository: Repository<Book>;

    const mockBookRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOneBy: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookService,
                {
                    provide: getRepositoryToken(Book),
                    useValue: mockBookRepository,
                },
            ],
        }).compile();

        service = module.get<BookService>(BookService);
        bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createBook', () => {
        it('should successfully create a book', async () => {
            const createBookDto = { title: 'Test Book', author: 'John Doe' } as any;
            const book = { ...createBookDto, id: 1 };

            mockBookRepository.create.mockReturnValue(book);
            mockBookRepository.save.mockResolvedValue(book);

            const result = await service.createBook(createBookDto);

            expect(bookRepository.create).toHaveBeenCalledWith(createBookDto);
            expect(bookRepository.save).toHaveBeenCalledWith(book);
            expect(result).toEqual(book);
        });
    });

    describe('updateBook', () => {
        it('should successfully update a book', async () => {
            const updateData = { book_name: 'Updated Title' };
            const book = { id: 1, book_name: 'Test Book', num_of_pages: 123 };
            const updatedBook = { ...book, ...updateData };

            mockBookRepository.findOneBy.mockResolvedValue(book);
            mockBookRepository.save.mockResolvedValue(updatedBook);

            const result = await service.updateBook(1, updateData);

            expect(bookRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(bookRepository.save).toHaveBeenCalledWith(updatedBook);
            expect(result).toEqual(updatedBook);
        });

        it('should throw an error if the book is not found', async () => {
            const updateData = { book_name: 'Updated Title' };
            mockBookRepository.findOneBy.mockResolvedValue(null);

            await expect(service.updateBook(999, updateData))
                .rejects
                .toThrow(new BadRequestException('Book not found'));
        });
    });

    describe('getAllBooks', () => {
        it('should return an array of books', async () => {
            const books = [
                { id: 1, title: 'Book 1', author: 'Author 1' },
                { id: 2, title: 'Book 2', author: 'Author 2' },
            ];

            mockBookRepository.find.mockResolvedValue(books);

            const result = await service.getAllBooks();

            expect(bookRepository.find).toHaveBeenCalled();
            expect(result).toEqual(books);
        });
    });
});
