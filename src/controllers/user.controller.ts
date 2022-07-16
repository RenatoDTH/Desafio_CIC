import { Request, Response } from 'express';
import { UserService } from '../services';

class UserController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, cpf, phone, email } = request.body;

    const data = {
      name,
      cpf,
      phone,
      email,
      isSeller: request.body.isSeller ? request.body.isSeller : '',
    };

    const userService = new UserService();

    const user = await userService.create(data);

    return response.status(201).json(user);
  }
}

export { UserController };
