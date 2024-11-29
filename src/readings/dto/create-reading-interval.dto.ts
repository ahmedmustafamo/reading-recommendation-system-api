import { IsInt, IsPositive, Min, Max } from 'class-validator';

export class CreateReadingIntervalDto {
  @IsInt()
  @IsPositive()
  user_id: number;

  @IsInt()
  @IsPositive()
  book_id: number;

  @IsInt()
  @Min(1)
  start_page: number;

  @IsInt()
  @Min(1)
  @Max(10000)
  end_page: number;
}
