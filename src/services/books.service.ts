/* eslint-disable array-callback-return */
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
            const data = {
              ...el,
              seller: user.name,
              sellerId: user.id,
            };
            const doesItExist = await this.booksRepository.findOne(data);

            if (doesItExist) {
              return;
            }

            const book = this.booksRepository.create(data);

            await this.booksRepository.save(book);
          });

          queryForOneHundred(array);
        } else {
          arrayofObjects.forEach(async el => {
            const data = {
              ...el,
              seller: user.name,
              sellerId: user.id,
            };

            const doesItExist = await this.booksRepository.findOne(data);

            if (doesItExist) {
              return;
            }

            const book = this.booksRepository.create(data);

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

  async index(body): Promise<any> {
    const {
      publisher,
      publicationDate,
      title,
      priceOrder,
      publicationDateOrder,
    } = body;

    const books = await this.booksRepository.find();
    const lowerPricesBooks = [];
    books.map(el => {
      const filteredByName = books.filter(
        element => element.title === el.title,
      );

      if (filteredByName.length > 1) {
        filteredByName.sort((a, b) => {
          return a.price - b.price;
        });

        const checkExistence = lowerPricesBooks.find(
          ele => ele === filteredByName[0],
        );

        if (checkExistence) {
          return;
        }

        lowerPricesBooks.push(filteredByName[0]);
      } else {
        lowerPricesBooks.push(el);
      }
    });

    if (publisher) {
      const filter = lowerPricesBooks.filter(el => el.publisher === publisher);
      if (filter.length) {
        return filter;
      }
    }

    if (publicationDate) {
      const filter = lowerPricesBooks.filter(
        el => el.publicationDate === publicationDate,
      );
      if (filter.length) {
        return filter;
      }
    }

    if (title) {
      const filter = lowerPricesBooks.filter(el => el.title === title);
      if (filter.length) {
        return filter;
      }
    }

    if (priceOrder) {
      lowerPricesBooks.sort((a, b) => {
        return a.price - b.price;
      });
    }

    if (publicationDateOrder) {
      lowerPricesBooks.sort((a, b) => {
        const aDate: any = new Date(a.publicationDate);
        const bDate: any = new Date(b.publicationDate);

        return aDate - bDate;
      });
    }

    return lowerPricesBooks;
  }

  async buy(title): Promise<any> {
    const books = await this.booksRepository.find({ title });

    if (!books.length) {
      return {
        success: false,
        message: 'Nenhum livro encontrado',
      };
    }

    const lowerPricesBooks = [];
    books.map(el => {
      const filteredByName = books.filter(
        element => element.title === el.title,
      );

      if (filteredByName.length > 1) {
        filteredByName.sort((a, b) => {
          return a.price - b.price;
        });

        const checkExistence = lowerPricesBooks.find(
          ele => ele === filteredByName[0],
        );

        if (checkExistence) {
          return;
        }

        lowerPricesBooks.push(filteredByName[0]);
      } else {
        lowerPricesBooks.push(el);
      }
    });

    return {
      success: true,
      title: lowerPricesBooks[0].title,
      authors: lowerPricesBooks[0].authors,
      price: lowerPricesBooks[0].price,
      seller: lowerPricesBooks[0].seller,
    };
  }
}

export { BooksService };
