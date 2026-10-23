# Resultados dos testes manuais

## Identificação da execução

- Data: 23/10/2026
- Cliente HTTP: coleção Postman executada com Newman 6.2.3
- Ambiente: Windows, Node.js 24.16.0
- Banco: SQLite isolado e vazio no início da execução
- Coleção: [`postman/Event-Manager.postman_collection.json`](../postman/Event-Manager.postman_collection.json)

## Resultados

| Cenário | Resultado esperado | Resultado obtido | Situação |
| --- | --- | --- | --- |
| Criar evento sem `capacity` | `400 Bad Request` com erro de validação | `400 Bad Request`; resposta apontou o campo `capacity` | Aprovado |
| Criar evento com capacidade 2 | `201 Created` | `201 Created`; evento criado com ID 1 e capacidade 2 | Aprovado |
| Inscrever o primeiro participante | `201 Created` | `201 Created` | Aprovado |
| Inscrever o segundo participante | `201 Created` | `201 Created` | Aprovado |
| Inscrever um terceiro participante | `403 Forbidden` informando lotação | `403 Forbidden`; mensagem informou que o evento está lotado | Aprovado |
| Listar os eventos | `200 OK` e duas inscrições no evento criado | `200 OK`; `registrationCount` igual a 2 | Aprovado |

## Resumo da execução

- Iterações: 1 executada, 0 falhas.
- Requisições: 6 executadas, 0 falhas.
- Scripts de teste: 6 executados, 0 falhas.
- Asserções: 10 executadas, 0 falhas.
- Tempo total: 544 ms.
- Tempo médio de resposta: 22 ms.

Todos os cenários obrigatórios descritos no enunciado foram aprovados. Não foi necessário alterar a implementação da API após a execução.

## Reprodução

1. Instale as dependências com `npm ci`.
2. Inicie a API com `npm start`.
3. Importe a coleção no Postman e execute as requisições na ordem apresentada.

Como alternativa, com a API em execução, a mesma coleção pode ser validada pela linha de comando:

```sh
npx newman run postman/Event-Manager.postman_collection.json
```
