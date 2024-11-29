import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TimeStampEntity } from '../common/entities/timestamp.entity';
import { User } from '../users/user.entity';
import { Book } from '../books/book.entity';

@Entity('readings')
export class Reading extends TimeStampEntity {
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Book, { eager: true })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column()
  start_page: number;

  @Column()
  end_page: number;
}
