import { Request, Response } from 'express';
import { BooksService } from '../services';

class BooksController {
  async create(request: Request, response: Response): Promise<Response> {
    if (request.file) {
      const { name, email } = request.body;
      const { filename, mimetype } = request.file;

      const data = {
        name,
        email,
        filename,
        mimetype,
      };

      const booksService = new BooksService();

      const books = await booksService.create(data);

      return response.json(books);
    }
    response.status(409);

    return response.json({
      sucess: false,
      message: 'Não é um tipo de arquivo válido',
    });
  }

  async index(request: Request, response: Response): Promise<Response> {
    const {
      publisher,
      publicationDate,
      title,
      priceOrder,
      publicationDateOrder,
    } = request.query;

    const data: any = {
      publisher,
      publicationDate,
      title,
      priceOrder,
      publicationDateOrder,
    };

    const booksService = new BooksService();

    const books = await booksService.index(data);

    return response.json(books);
  }

  async buy(request: Request, response: Response): Promise<Response> {
    const { title } = request.body;

    const booksService = new BooksService();

    const books = await booksService.buy(title);

    return response.json(books);
  }

  async createByPdf(request: Request, response: Response): Promise<Response> {
    if (request.file) {
      const { name, email, price } = request.body;
      const { filename, mimetype } = request.file;

      const data = {
        name,
        email,
        filename,
        mimetype,
        price,
      };

      const booksService = new BooksService();

      const books = await booksService.createByPdf(data);

      return response.json(books);
    }
    response.status(409);

    return response.json({
      sucess: false,
      message: 'Não é um tipo de arquivo válido',
    });
  }
}

export { BooksController };
