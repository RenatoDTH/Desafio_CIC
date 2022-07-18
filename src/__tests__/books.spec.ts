import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';
import createConnection from '../database/connection';

describe('User', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  describe('Books', () => {
    test('should return success if book is bought', async () => {
      const response = await request(app).post('/books/buy').send({
        title: 'book test 3',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title');
    });

    test('should return message of not found if book does not exist', async () => {
      const response = await request(app).post('/books/buy').send({
        title: 'book test 4',
      });

      expect(response.status).toBe(200);
      expect(response.body).not.toHaveProperty('title');
    });

    test('should list all books', async () => {
      const response = await request(app).get('/books');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
    });
  });
});
