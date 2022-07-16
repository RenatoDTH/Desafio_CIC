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
            type: 'string',
          },
          {
            name: 'publisher',
            type: 'string',
          },
          {
            name: 'price',
            type: 'int',
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
          price: 94.1,
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
