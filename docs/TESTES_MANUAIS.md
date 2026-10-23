# Testes manuais da API

Roteiro para verificar os endpoints em um cliente HTTP, como Thunder Client, Postman ou Insomnia. Os itens abaixo descrevem cenários e resultados esperados; não representam um relatório de execução.

## Cenários

- [ ] Iniciar a API e escolher o cliente HTTP.
- [ ] Enviar `POST /events` sem `capacity` e registrar a resposta `400` com detalhes da validação Joi.
- [ ] Criar um evento válido de capacidade `2`; registrar a resposta `201` e o ID gerado.
- [ ] Inscrever dois participantes nesse evento com `POST /events/:id/register`; registrar ambas as respostas `201`.
- [ ] Tentar inscrever um terceiro participante; registrar a resposta `403` de evento lotado.
- [ ] Consultar `GET /events` e confirmar os dados do evento e `registrationCount: 2`.

## Registro dos resultados

- [ ] Salvar a coleção de requisições do cliente HTTP utilizado para permitir a reprodução.
- [ ] Registrar os resultados reais e as evidências dos testes em um arquivo próprio, por exemplo `RESULTADOS_TESTES.md`.
- [ ] Corrigir eventuais problemas encontrados e repetir os cenários afetados.

Use um evento recém-criado para executar o roteiro, pois o SQLite preserva inscrições de execuções anteriores. Não marque os itens como concluídos antes de executá-los.
