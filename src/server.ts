import 'dotenv/config';
import './models';

import app from './app';
import sequelize from './config/database';

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log('Conexão com o banco estabelecida.');

    await sequelize.sync();

    const port = Number(process.env.PORT ?? 3000);

    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar a aplicação:', error);
    process.exitCode = 1;
  }
}

void startServer();