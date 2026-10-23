# Testes manuais da API

Roteiro executado com a coleção Postman por meio do Newman. Os resultados completos estão registrados em [RESULTADOS_TESTES.md](RESULTADOS_TESTES.md), e a coleção pode ser importada no Postman a partir de [`postman/Event-Manager.postman_collection.json`](../postman/Event-Manager.postman_collection.json).

## Cenários

- [x] Iniciar a API e escolher o cliente HTTP.
- [x] Enviar `POST /events` sem `capacity` e registrar a resposta `400` com detalhes da validação Joi.
- [x] Criar um evento válido de capacidade `2`; registrar a resposta `201` e o ID gerado.
- [x] Inscrever dois participantes nesse evento com `POST /events/:id/register`; registrar ambas as respostas `201`.
- [x] Tentar inscrever um terceiro participante; registrar a resposta `403` de evento lotado.
- [x] Consultar `GET /events` e confirmar os dados do evento e `registrationCount: 2`.

## Registro dos resultados

- [x] Salvar a coleção de requisições do cliente HTTP utilizado para permitir a reprodução.
- [x] Registrar os resultados reais e as evidências dos testes em `RESULTADOS_TESTES.md`.
- [x] Confirmar que nenhum dos cenários apresentou falhas.

Para repetir os testes, inicie a API com um banco vazio e execute a coleção na ordem apresentada. O SQLite preserva inscrições de execuções anteriores.
