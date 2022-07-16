import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('books')
class Books {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  title: string;

  @Column()
  authors: string;

  @Column()
  numPages: number;

  @Column()
  publicationDate: string;

  @Column()
  publisher: string;

  @Column()
  price: number;

  @Column()
  seller: string;

  @Column()
  sellerId: string;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { Books };
