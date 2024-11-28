import { Entity, Column } from 'typeorm';
import { TimeStampEntity } from '../common/entities/timestamp.entity';

@Entity('users')
export class User extends TimeStampEntity {
  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;
}
