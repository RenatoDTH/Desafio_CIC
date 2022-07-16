import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Books1658000335651 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'books',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'authors',
            type: 'varchar',
          },
          {
            name: 'numPages',
            type: 'int',
          },
          {
            name: 'publicationDate',
            type: 'varchar',
          },
          {
            name: 'publisher',
            type: 'varchar',
          },
          {
            name: 'price',
            type: 'int',
          },
          {
            name: 'seller',
            type: 'varchar',
          },
          {
            name: 'sellerId',
            type: 'varchar',
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
      .into('books')
      .values([
        {
          id: 'e068cc73-859b-41fa-bb91-c317f0d335c7',
          title: 'book test 1',
          authors: 'author test 1',
          numPages: 200,
          publicationDate: '09/01/2004',
          publisher: 'publisher test',
          price: 94.2,
          seller: 'Eduardo',
          sellerId: 'e068cc73-859b-41fa-bb91-c317f0d335c5',
          created_at: '2021-05-17T20:01:45.000Z',
          updated_at: '2021-05-17T20:01:45.000Z',
        },
        {
          id: 'e068cc73-859b-41fa-bb91-c317f0d335d8',
          title: 'book test 2',
          authors: 'author test 2',
          numPages: 210,
          publicationDate: '09/01/2005',
          publisher: 'publisher test2',
          price: 94.35,
          seller: 'Eduardo',
          sellerId: 'e068cc73-859b-41fa-bb91-c317f0d335c5',
          created_at: '2021-05-17T20:01:45.000Z',
          updated_at: '2021-05-17T20:01:45.000Z',
        },
        {
          id: 'e068cc73-859b-41fa-bb91-c317f0d335f7',
          title: 'book test 3',
          authors: 'author test 3',
          numPages: 220,
          publicationDate: '09/01/2003',
          publisher: 'publisher test3',
          price: 74.1,
          seller: 'Eduardo',
          sellerId: 'e068cc73-859b-41fa-bb91-c317f0d335c5',
          created_at: '2021-05-17T20:01:45.000Z',
          updated_at: '2021-05-17T20:01:45.000Z',
        },
        {
          id: 'e068cc73-859b-41fa-bb91-c317f0d333c7',
          title: 'book test 1',
          authors: 'author test 1',
          numPages: 200,
          publicationDate: '09/01/2003',
          publisher: 'publisher test',
          price: 84.2,
          seller: 'Mario',
          sellerId: 'eace4909-89b4-448d-8d4a-65eea3fe9229',
          created_at: '2021-05-17T20:01:45.000Z',
          updated_at: '2021-05-17T20:01:45.000Z',
        },
        {
          id: 'e068cc73-859b-41fa-bb91-c317f0e335d8',
          title: 'book test 2',
          authors: 'author test 2',
          numPages: 210,
          publicationDate: '09/01/2006',
          publisher: 'publisher test2',
          price: 100.35,
          seller: 'Mario',
          sellerId: 'eace4909-89b4-448d-8d4a-65eee3fe9229',
          created_at: '2021-05-17T20:01:45.000Z',
          updated_at: '2021-05-17T20:01:45.000Z',
        },
        {
          id: 'e068cc73-859b-41fa-bb91-c31710d335f7',
          title: 'book test 3',
          authors: 'author test 3',
          numPages: 220,
          publicationDate: '09/01/2003',
          publisher: 'publisher test3',
          price: 94.1,
          seller: 'Mario',
          sellerId: 'eace4909-89b4-448d-8d4a-65eee3fe9229',
          created_at: '2021-05-17T20:01:45.000Z',
          updated_at: '2021-05-17T20:01:45.000Z',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('books');
  }
}
