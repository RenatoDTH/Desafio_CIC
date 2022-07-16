import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Users1657912383246 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'phone',
            type: 'varchar',
          },
          {
            name: 'cpf',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'isSeller',
            type: 'boolean',
            default: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('users')
      .values([
        {
          id: 'e068cc73-859b-41fa-bb91-c317f0d335c5',
          name: 'Eduardo',
          phone: '11910345292',
          cpf: '18406097027',
          email: 'Eduardo@hotmail.com',
          isSeller: true,
          created_at: '2021-05-17T20:01:45.000Z',
          updated_at: '2021-05-17T20:01:45.000Z',
        },
        {
          id: 'eace4909-89b4-448d-8d4a-65eee3fe9229',
          name: 'Mario',
          phone: '11994345297',
          cpf: '05522221003',
          email: 'Mario@hotmail.com',
          isSeller: true,
          created_at: '2021-05-17T20:01:47.000Z',
          updated_at: '2021-05-17T20:01:47.000Z',
        },
        {
          id: 'b23c0ce5-52ae-4ab7-845c-fdd97d3e6fcd',
          name: 'Aline',
          phone: '11972345297',
          cpf: '45415359044',
          email: 'Aline@hotmail.com',
          isSeller: false,
          created_at: '2021-05-17T20:01:48.000Z',
          updated_at: '2021-05-17T20:01:48.000Z',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
