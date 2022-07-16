import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { routes } from './routes';
import 'reflect-metadata';
import createConnection from './database/connection';
import { AppError } from './errors/AppError';

createConnection();
const app = express();
app.use(cors());

app.use(express.json());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'Error',
    message: `Internal server error ${err.message}`,
  });
});

export { app };
