import { Repository, getCustomRepository } from 'typeorm';
import fs from 'fs';
import { convertCSVToArray } from 'convert-csv-to-array';
import { stringify } from 'querystring';
import { Books, User } from '../entities';
import { AppError } from '../errors/AppError';
import { UserRepository } from '../repositories';
import { BooksRepository } from '../repositories/books.repository';

interface createBooksDto {
  name: string;
  email: string;
  filename: string;
  mimetype: string;
}

class BooksService {
  private userRepository: Repository<User>;

  private booksRepository: Repository<Books>;

  constructor() {
    this.userRepository = getCustomRepository(UserRepository);
    this.booksRepository = getCustomRepository(BooksRepository);
  }

  async create(body: createBooksDto): Promise<any> {
    const { email, filename, mimetype } = body;

    const user = await this.userRepository.findOne({
      email,
    });

    if (!user) {
      throw new AppError('Usuário não existente!');
    }

    if (!user.isSeller) {
      throw new AppError(
        'Usuário não é vendedor. Ele não pode cadastrar o catálogo',
      );
    }

    if (mimetype !== 'text/csv') {
      throw new AppError('Arquivo csv necessário');
    }

    const contents = await fs.promises.readFile(
      `./upload/${filename}`,
      'utf-8',
    );

    const arrayofObjects = convertCSVToArray(contents, {
      separator: ',',
    }).slice(1);
    fs.unlinkSync(`./upload/${filename}`);

    let newArray;

    try {
      const queryForOneHundred = array => {
        if (array.length > 100) {
          newArray = arrayofObjects.splice(0, 100);

          newArray.forEach(async el => {
            const doesItExist = this.booksRepository.findOne(el);

            if (doesItExist) {
              return;
            }

            const book = this.booksRepository.create(el);

            await this.booksRepository.save(book);
          });

          queryForOneHundred(array);
        } else {
          arrayofObjects.forEach(async el => {
            const doesItExist = this.booksRepository.findOne(el);

            if (doesItExist) {
              return;
            }

            const book = this.booksRepository.create(el);

            await this.booksRepository.save(book);
          });
        }
      };

      queryForOneHundred(arrayofObjects);

      return {
        success: true,
        message: 'Catálogo adicionado.',
      };
    } catch (err) {
      throw new AppError(stringify(err.message));
    }
  }
}

export { BooksService };
