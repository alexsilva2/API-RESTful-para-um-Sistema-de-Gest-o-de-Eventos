const express = require('express');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

app.use(express.json());
app.use('/events', eventRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'O corpo da requisição contém JSON inválido.' });
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({ message: 'O corpo da requisição excede o limite permitido.' });
  }

  console.error(error);
  res.status(500).json({ message: 'Erro interno do servidor.' });
});

module.exports = app;
