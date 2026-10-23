const app = require('./app');
const sequelize = require('./database');

const port = process.env.PORT || 3000;

async function start() {
  await sequelize.sync();

  const server = app.listen(port, () => {
    console.log(`API de eventos disponível em http://localhost:${port}`);
  });

  server.on('error', async (error) => {
    console.error('Não foi possível abrir a porta do servidor:', error.message);
    await sequelize.close();
    process.exitCode = 1;
  });
}

start().catch(async (error) => {
  console.error('Não foi possível iniciar a API:', error.message);
  await sequelize.close();
  process.exitCode = 1;
});
