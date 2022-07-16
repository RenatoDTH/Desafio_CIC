import * as Yup from 'yup';
import { validateCPF, validatePhone, validateEmail } from 'validations-br';
import { getCustomRepository, Repository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { UserRepository } from '../repositories';
import { User } from '../entities';

interface userDto {
  name: string;
  phone: string;
  cpf: string;
  email: string;
  isSeller?: boolean;
}

interface IUserResponse extends User {
  success: boolean;
}

class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = getCustomRepository(UserRepository);
  }

  async create(body: userDto): Promise<IUserResponse> {
    const { name, phone, cpf, email } = body;

    const schema = Yup.object().shape({
      name: Yup.string().required('Nome obrigatório'),
      cpf: Yup.string()
        .required('CPF obrigatório')
        .max(11, 'CPF só deve conter dígitos')
        .test('validação do cpf', 'CPF Inválido', value => validateCPF(value)),
      phone: Yup.string()
        .required('Telefone obrigatório')
        .min(10, 'Telefone só deve conter dígitos')
        .max(11, 'Telefone só deve conter dígitos')
        .test('validação do telefone', 'Telefone Inválido', value =>
          validatePhone(value),
        ),
      email: Yup.string()
        .required('E-mail obrigatório')
        .test('validação do e-mail', 'E-mail Inválido', value =>
          validateEmail(value),
        ),
    });

    const data: userDto = {
      name,
      phone,
      cpf,
      email,
    };

    try {
      await schema.validate(data, { abortEarly: false });
    } catch (err) {
      throw new AppError(err.message);
    }

    const phoneAlreadyExists = await this.userRepository.findOne({
      phone,
    });

    if (phoneAlreadyExists) {
      throw new AppError('Telefone já existente!');
    }

    const cpfAlreadyExists = await this.userRepository.findOne({
      cpf,
    });

    if (cpfAlreadyExists) {
      throw new AppError('CPF já existente!');
    }

    const emailAlreadyExists = await this.userRepository.findOne({
      email,
    });

    if (emailAlreadyExists) {
      throw new AppError('E-mail já existente!');
    }

    if (!body.isSeller || body.isSeller !== ('true' || true)) {
      data.isSeller = false;
    } else {
      data.isSeller = true;
    }

    const user = this.userRepository.create(data);

    await this.userRepository.save(user);

    return {
      success: true,
      ...user,
    };
  }
}

export { UserService };
