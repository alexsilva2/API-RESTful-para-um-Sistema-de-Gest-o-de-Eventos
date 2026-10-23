# API RESTful para um Sistema de Gestão de Eventos

API para cadastro de eventos e gerenciamento de inscrições, com validação dos dados, persistência em SQLite e controle de vagas por evento.

## Funcionalidades

- Cadastro de eventos com título, data e capacidade máxima.
- Listagem de eventos com a quantidade de inscrições realizadas.
- Inscrição de participantes com nome e email.
- Bloqueio de novas inscrições quando o evento atinge sua capacidade.
- Validação de requisições e respostas de erro em JSON.
- Interface web responsiva para cadastrar eventos, inscrever participantes e acompanhar vagas.

## Tecnologias

| Tecnologia | Finalidade |
| --- | --- |
| Node.js | Execução do servidor |
| Express | Rotas HTTP e middlewares |
| Joi | Validação dos dados de entrada |
| Sequelize | Mapeamento dos modelos e acesso ao banco |
| SQLite | Persistência local dos dados |
| HTML, CSS e JavaScript | Interface web integrada à API |

## Instalação e execução

### Pré-requisitos

- Node.js 22 ou superior.
- npm.
- Git para clonar o repositório.

### Instalação

```sh
git clone https://github.com/alexsilva2/API-RESTful-para-um-Sistema-de-Gest-o-de-Eventos.git
cd API-RESTful-para-um-Sistema-de-Gest-o-de-Eventos
npm ci
npm start
```

O servidor atende em `http://localhost:3000`. Abra esse endereço no navegador para acessar o painel de eventos. O endpoint `/events` continua disponível para consultar os dados em JSON.

### Usar a interface

1. Preencha o nome, a data, o horário e a capacidade no formulário **Novo evento**.
2. Clique em **Criar evento** para salvar e exibir o evento na lista.
3. Clique em **Inscrever participante** no evento desejado e informe nome e email.
4. Acompanhe as inscrições e as vagas restantes nos cartões e no resumo do painel.

Eventos sem vagas ficam identificados como **Lotado**, com o botão de inscrição desabilitado. O botão **Atualizar** consulta novamente os dados, incluindo alterações feitas por outros clientes. Datas e horários são apresentados no fuso local do dispositivo.

O arquivo `database.sqlite` é criado automaticamente na raiz após a sincronização dos modelos e preserva os dados entre execuções. O banco local e as dependências não são versionados.

Para reiniciar automaticamente ao editar o código:

```sh
npm run dev
```

## Configuração

| Variável de ambiente | Padrão | Descrição |
| --- | --- | --- |
| `PORT` | `3000` | Porta HTTP do servidor |
| `DB_STORAGE` | `database.sqlite` na raiz | Caminho do arquivo SQLite |

As variáveis devem ser definidas no ambiente antes de iniciar o servidor. O projeto não carrega arquivos `.env` automaticamente.

## Endpoints

URL base local: `http://localhost:3000`. Envie os corpos de requisição como JSON com `Content-Type: application/json`.

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/events` | Criar um evento |
| `GET` | `/events` | Listar eventos e suas contagens de inscrições |
| `POST` | `/events/:id/register` | Inscrever um participante |

### `POST /events`

Cria um evento e retorna `201` com o registro persistido, incluindo seu `id`.

```json
{
  "title": "Workshop de Node.js",
  "date": "2026-11-20T19:00:00-03:00",
  "capacity": 2
}
```

| Campo | Regra |
| --- | --- |
| `title` | String obrigatória e não vazia |
| `date` | Data obrigatória em formato ISO 8601 |
| `capacity` | Inteiro positivo obrigatório |

Dados inválidos retornam `400` com a lista `details` de campos e mensagens de validação.

### `GET /events`

Retorna `200` com uma lista de eventos ordenados pelo ID. Cada evento inclui `registrationCount`, inclusive quando não há inscrições (`0`). A lista é vazia quando não há eventos cadastrados.

### `POST /events/:id/register`

Substitua `:id` pelo ID retornado na criação do evento. O nome do participante e um email válido são obrigatórios.

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

## Regras de negócio

- Cada evento possui uma capacidade máxima e pode ter várias inscrições.
- Cada inscrição pertence a um único evento.
- A API verifica a existência do evento e a disponibilidade de vagas antes de salvar a inscrição.
- A consulta de vagas e a criação da inscrição usam uma única transação SQLite do tipo `IMMEDIATE`, evitando que inscrições simultâneas ultrapassem a capacidade.
- O email não é exclusivo por evento: requisições repetidas podem gerar novas inscrições enquanto houver vagas.

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
public/index.html         Painel de eventos e formulários
public/styles.css         Estilos e layout responsivo
public/app.js             Integração da interface com a API
docs/TESTES_MANUAIS.md    Roteiro de verificação dos endpoints
```

## Verificação manual

O [roteiro de testes manuais](docs/TESTES_MANUAIS.md) descreve os cenários de criação, inscrição, lotação e listagem para execução em um cliente HTTP, como Postman, Insomnia ou Thunder Client.
