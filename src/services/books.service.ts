/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
import { Repository, getCustomRepository } from 'typeorm';
import fs from 'fs';
import { convertCSVToArray } from 'convert-csv-to-array';
import { stringify } from 'querystring';
import pdf from 'pdf-parse';
import { Books, User } from '../entities';
import { AppError } from '../errors/AppError';
import { UserRepository } from '../repositories';
import { BooksRepository } from '../repositories/books.repository';
import { formatDate } from '../common';
import {
  ICreateBooksRequest,
  ICreateBookResponse,
  IIndexRequest,
  IIndexResponse,
  IBuyResponse,
  IBuyNoResponse,
  ISubmitOneBookRequest,
  ISubmitByPdfResponse,
  ISubmitByPdfNoResponse,
} from '../interfaces';

class BooksService {
  private userRepository: Repository<User>;

  private booksRepository: Repository<Books>;

  constructor() {
    this.userRepository = getCustomRepository(UserRepository);
    this.booksRepository = getCustomRepository(BooksRepository);
  }

  async create(body: ICreateBooksRequest): Promise<ICreateBookResponse> {
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
      fs.unlinkSync(`./upload/${filename}`);
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

  async index(body: IIndexRequest): Promise<IIndexResponse | IIndexResponse[]> {
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

  async buy(title: string): Promise<IBuyResponse | IBuyNoResponse> {
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

  async createByPdf(
    body: ISubmitOneBookRequest,
  ): Promise<ISubmitByPdfResponse | ISubmitByPdfNoResponse> {
    const { email, filename, mimetype, price } = body;

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

    if (mimetype !== 'application/pdf') {
      fs.unlinkSync(`./upload/${filename}`);
      throw new AppError('Arquivo pdf necessário');
    }

    const contents = fs.readFileSync(`./upload/${filename}`);

    const dataToBeSaved: any = {
      seller: user.name,
      sellerId: user.id,
      price: Number(price),
    };

    let dataText: any;

    const regexTitle = /Title:.+/g;
    const regexAuthor = /Author:.+/g;
    const regexPublicationDate = /Last.+Updated:.+/g;
    const regexPublisher = /Project.+Gutenberg/g;

    await pdf(contents).then(data => {
      dataToBeSaved.numPages = data.numpages;
      dataText = data.text;
    });
    dataText = dataText.replace(/\s\s+/g, ' ');

    let titleFromRegex = dataText.match(regexTitle);
    if (titleFromRegex) {
      titleFromRegex = titleFromRegex[0].replace(/\t/g, ' ');
      titleFromRegex = titleFromRegex.split('Title: ')[1];
    }

    dataToBeSaved.title = titleFromRegex || 'N/A';

    if (dataToBeSaved.title === 'N/A') {
      return {
        success: false,
        message: 'Não foi possível pegar as informações do pdf',
      };
    }

    let authorFromRegex = dataText.match(regexAuthor);
    if (authorFromRegex) {
      authorFromRegex = authorFromRegex[0].replace(/\t/g, ' ');
      authorFromRegex = authorFromRegex.split('Author: ')[1];
    }
    dataToBeSaved.authors = authorFromRegex || 'N/A';

    let publicationDateFromRegex = dataText.match(regexPublicationDate);
    if (publicationDateFromRegex) {
      publicationDateFromRegex = publicationDateFromRegex[0].replace(
        /\t/g,
        ' ',
      );
      publicationDateFromRegex =
        publicationDateFromRegex.split('Last Updated: ')[1];
    }
    const dateFormatted = publicationDateFromRegex
      ? formatDate(publicationDateFromRegex)
      : '01/01/2000';
    dataToBeSaved.publicationDate = dateFormatted;

    let publisherFromRegex = dataText.match(regexPublisher);
    if (publisherFromRegex) {
      publisherFromRegex = publisherFromRegex[0].replace(/\t/g, ' ');
    }

    dataToBeSaved.publisher = publisherFromRegex || 'N/A';

    const doesItExist = await this.booksRepository.findOne(dataToBeSaved);

    if (doesItExist) {
      return {
        success: false,
        message: 'Este livro já foi cadastrado.',
      };
    }

    const book = this.booksRepository.create(dataToBeSaved);

    await this.booksRepository.save(book);

    fs.unlinkSync(`./upload/${filename}`);

    return {
      success: true,
      dataToBeSaved,
    };
  }
}

export { BooksService };
