import { TimeStampEntity } from '../common/entities/timestamp.entity';
import { Entity, Column } from 'typeorm';

@Entity('books')
export class Book extends TimeStampEntity {
  @Column()
  book_name: string;

  @Column()
  num_of_pages: number;
}
