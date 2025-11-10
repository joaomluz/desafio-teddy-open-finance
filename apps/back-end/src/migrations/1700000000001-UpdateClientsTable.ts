import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateClientsTable1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar se a tabela clients existe
    const table = await queryRunner.getTable('clients');
    
    if (!table) {
      // Se a tabela não existe, a migração inicial vai criar
      return;
    }

    // Verificar se as novas colunas já existem
    const salaryColumn = table.findColumnByName('salary');
    const companyValueColumn = table.findColumnByName('company_value');
    const emailColumn = table.findColumnByName('email');
    const phoneColumn = table.findColumnByName('phone');
    const addressColumn = table.findColumnByName('address');

    // Se as novas colunas já existem, a migração já foi executada
    if (salaryColumn && companyValueColumn) {
      return;
    }

    // Passo 1: Adicionar novas colunas como nullable primeiro
    if (!salaryColumn) {
      await queryRunner.addColumn(
        'clients',
        new TableColumn({
          name: 'salary',
          type: 'decimal',
          precision: 10,
          scale: 2,
          isNullable: true, // Temporariamente nullable
        }),
      );
    }

    if (!companyValueColumn) {
      await queryRunner.addColumn(
        'clients',
        new TableColumn({
          name: 'company_value',
          type: 'decimal',
          precision: 12,
          scale: 2,
          isNullable: true, // Temporariamente nullable
        }),
      );
    }

    // Passo 2: Atualizar valores NULL com defaults
    await queryRunner.query(`
      UPDATE clients 
      SET salary = 0 
      WHERE salary IS NULL
    `);

    await queryRunner.query(`
      UPDATE clients 
      SET company_value = 0 
      WHERE company_value IS NULL
    `);

    // Passo 3: Tornar as colunas NOT NULL
    await queryRunner.changeColumn(
      'clients',
      'salary',
      new TableColumn({
        name: 'salary',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: false,
        default: 0,
      }),
    );

    await queryRunner.changeColumn(
      'clients',
      'company_value',
      new TableColumn({
        name: 'company_value',
        type: 'decimal',
        precision: 12,
        scale: 2,
        isNullable: false,
        default: 0,
      }),
    );

    // Passo 4: Remover colunas antigas se existirem
    if (emailColumn) {
      await queryRunner.dropColumn('clients', 'email');
    }
    if (phoneColumn) {
      await queryRunner.dropColumn('clients', 'phone');
    }
    if (addressColumn) {
      await queryRunner.dropColumn('clients', 'address');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover novas colunas
    await queryRunner.dropColumn('clients', 'salary');
    await queryRunner.dropColumn('clients', 'company_value');

    // Restaurar colunas antigas
    await queryRunner.addColumn(
      'clients',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      'clients',
      new TableColumn({
        name: 'phone',
        type: 'varchar',
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      'clients',
      new TableColumn({
        name: 'address',
        type: 'text',
        isNullable: true,
      }),
    );
  }
}

