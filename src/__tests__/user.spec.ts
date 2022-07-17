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

  describe('Create User', () => {
    test('should return success if user is created', async () => {
      const response = await request(app).post('/users').send({
        name: 'Teste Teste',
        phone: '11972487714',
        email: 'teste5@teste.com',
        isSeller: 'true',
        cpf: '35736606062',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });

  test('should return 400 if cpf is invalid', async () => {
    const response = await request(app).post('/users').send({
      name: 'Teste Teste',
      phone: '11972487714',
      email: 'teste5@teste.com',
      isSeller: 'true',
      cpf: 'any_cpf',
    });
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'CPF Inválido',
      success: false,
    });
  });

  test('should return 400 if cpf does not have properly length', async () => {
    const response = await request(app).post('/users').send({
      name: 'Teste Teste',
      phone: '11972487714',
      email: 'teste5@teste.com',
      isSeller: 'true',
      cpf: '079.219.790-92',
    });
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'CPF só deve conter dígitos',
      success: false,
    });
  });

  test('should return 400 if phone is invalid', async () => {
    const response = await request(app).post('/users').send({
      name: 'Teste Teste',
      phone: '11111111111',
      email: 'teste5@teste.com',
      isSeller: 'true',
      cpf: '35736606062',
    });
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'Telefone Inválido',
      success: false,
    });
  });

  test('should return 400 if phone does not have properly length', async () => {
    const response = await request(app).post('/users').send({
      name: 'Teste Teste',
      phone: '(21)30212361',
      email: 'teste5@teste.com',
      isSeller: 'true',
      cpf: '35736606062',
    });
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'Telefone só deve conter dígitos',
      success: false,
    });
  });

  test('should return 400 if email is invalid', async () => {
    const response = await request(app).post('/users').send({
      name: 'Teste Teste',
      phone: '11972487735',
      email: 'tt.c',
      isSeller: 'true',
      cpf: '41973389029',
    });
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'E-mail Inválido',
      success: false,
    });
  });

  test('should return 400 if name is not provided', async () => {
    const response = await request(app).post('/users').send({
      phone: '11972487714',
      email: 'teste5@teste.com',
      isSeller: 'true',
      cpf: '35736606062',
    });
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'Nome obrigatório',
      success: false,
    });
  });
});
