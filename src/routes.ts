import { Router } from 'express';
import multer from 'multer';
import { UserController, BooksController } from './controllers';
import { UploadFile } from './middleware';

const routes = Router();

const userController = new UserController();
const booksController = new BooksController();
const uploadFile = new UploadFile();

routes.post('/users', userController.create);
routes.post(
  '/books/csv',
  multer(uploadFile.getConfig).single('upload'),
  booksController.create,
);
routes.get('/books', booksController.index);

export { routes };
