import dotenv from 'dotenv';
import { beforeAll, afterAll, beforeEach } from 'vitest';

dotenv.config();
dotenv.config({ path: '.env.test', override: true });

// Proteção para impedir que a suíte apague acidentalmente o banco de desenvolvimento.
const testDatabaseName = process.env.TEST_DB_NAME;
if (!testDatabaseName || !/_test$/i.test(testDatabaseName)) {
  throw new Error(
    'Defina TEST_DB_NAME com um banco exclusivo terminado em _test (ex.: impressao3d_test).',
  );
}

// O módulo Sequelize lê DB_NAME ao ser carregado. Por isso, a variável é definida
// antes da importação dos models e da aplicação feita pelos arquivos de teste.
process.env.DB_NAME = testDatabaseName;

let sequelize: import('sequelize').Sequelize;

beforeAll(async () => {
  // Importar o índice registra todos os relacionamentos antes do sync.
  await import('../../src/models/index.js');
  const database = await import('../../src/config/database.js');
  sequelize = (database as unknown as { default: import('sequelize').Sequelize }).default;

  await sequelize.authenticate();
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  // Exclui primeiro os registros dependentes e depois os registros-pai.
  // DELETE (em vez de TRUNCATE) respeita as FKs e funciona com a conexão do pool.
  for (const table of [
    'print_jobs',
    'payments',
    'order_items',
    'orders',
    'products',
    'materials',
    'printers',
    'customers',
    'users',
  ]) {
    await sequelize.query(`DELETE FROM \`${table}\``);
  }
});

afterAll(async () => {
  if (sequelize) await sequelize.close();
});
