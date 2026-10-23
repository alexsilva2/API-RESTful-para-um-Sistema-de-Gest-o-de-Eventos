# Event Manager API

API RESTful com Node.js, Express, Joi, Sequelize e SQLite para a atividade prática das aulas 11 e 12.

## Divisão do trabalho: 80% / 20%

O PDF contém cinco etapas. Esta entrega implementa **as etapas 1 a 4 (4/5 = 80% por etapas)**. Essa divisão não representa uma estimativa de horas ou da nota. A etapa 5, de testes manuais em um cliente HTTP, fica para o outro integrante.

| Etapa do PDF | Situação |
| --- | --- |
| 1. Estrutura base, Express e Router | Implementada |
| 2. Validação com Joi e respostas 400 | Implementada |
| 3. SQLite, Sequelize, modelos e relacionamento 1:N | Implementada |
| 4. Criação, listagem com contagem e inscrições com limite de vagas | Implementada |
| 5. Testes manuais no Thunder Client, Postman ou Insomnia | Pendente: outro integrante |

## Executar

Requer Node.js 22 ou superior e npm.

```sh
npm ci
npm start
```

O servidor atende em `http://localhost:3000`. O arquivo `database.sqlite` é criado automaticamente na raiz após a sincronização dos modelos e preserva os dados entre execuções. O banco local e as dependências não são versionados.

Para reiniciar automaticamente ao editar o código:

```sh
npm run dev
```

Configurações opcionais por variáveis de ambiente: `PORT` (padrão `3000`) e `DB_STORAGE` (padrão `database.sqlite` na raiz). O projeto não carrega arquivos `.env` automaticamente.

## Rotas

Enviar os corpos de requisição como JSON com `Content-Type: application/json`.

### `POST /events`

Cria um evento e retorna `201` com o registro persistido, incluindo seu `id`.

```json
{
  "title": "Workshop de Node.js",
  "date": "2026-11-20T19:00:00-03:00",
  "capacity": 2
}
```

`title` é uma string obrigatória e não vazia; `date` é uma data ISO obrigatória; `capacity` é um inteiro positivo obrigatório. Dados inválidos retornam `400` com a lista `details` de campos e mensagens de validação.

### `GET /events`

Retorna `200` com uma lista de eventos ordenados pelo ID. Cada evento inclui `registrationCount`, inclusive quando não há inscrições (`0`). A lista é vazia quando não há eventos cadastrados.

### `POST /events/:id/register`

Substituir `:id` pelo ID retornado na criação do evento.

```json
{
  "participantName": "Ana Silva",
  "email": "ana@example.com"
}
```

| Status | Significado |
| --- | --- |
| `201` | Inscrição criada |
| `400` | Nome, email, JSON ou ID inválido |
| `404` | Evento não encontrado |
| `403` | Evento lotado |

A consulta de vagas e a criação da inscrição usam uma única transação SQLite do tipo `IMMEDIATE`, evitando que inscrições simultâneas ultrapassem a capacidade. A atividade não exige exclusividade de email por evento.

## Organização

```text
app.js                    Configuração do Express e tratamento de erros
server.js                 Sincronização do banco e inicialização do servidor
database.js               Conexão Sequelize / SQLite
models/Event.js           Modelo de evento
models/Registration.js    Modelo de inscrição
models/index.js           Relacionamento entre os modelos
middleware/validation.js  Validações Joi
routes/eventRoutes.js     Rotas e regras de negócio
PENDENCIAS.md             Parte reservada ao outro integrante
```

Repositório: https://github.com/alexsilva2/API-RESTful-para-um-Sistema-de-Gest-o-de-Eventos

Esta entrega está organizada em commits separados de configuração, banco de dados, validações, API e documentação. O outro integrante deve concluir a etapa 5, fazer seu próprio commit e enviá-lo ao mesmo repositório para a entrega final.
