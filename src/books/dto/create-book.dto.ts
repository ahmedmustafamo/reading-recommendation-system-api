import { IsString, IsInt } from 'class-validator';

export class CreateBookDto {
  @IsString()
  book_name: string;

  @IsInt()
  num_of_pages: number;
}
