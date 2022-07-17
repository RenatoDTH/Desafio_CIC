import { User } from '../entities';

export interface IUserRequest {
  name: string;
  phone: string;
  cpf: string;
  email: string;
  isSeller?: boolean;
}

export interface IUserResponse extends User {
  success: boolean;
}
