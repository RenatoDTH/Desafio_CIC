import { EntityRepository, Repository } from 'typeorm';
import { Books } from '../entities';

@EntityRepository(Books)
class BooksRepository extends Repository<Books> {}

export { BooksRepository };
