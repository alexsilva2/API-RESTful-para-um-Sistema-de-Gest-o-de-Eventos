# Parte do outro integrante: etapa 5 (20% por etapas)

As etapas 1 a 4 estão implementadas. A etapa 5 deve ser executada manualmente por você em Thunder Client, Postman ou Insomnia. Esta lista é um roteiro; não representa testes já executados ou aprovados.

## Testes manuais exigidos pelo PDF

- [ ] Iniciar a API e escolher o cliente HTTP.
- [ ] Enviar `POST /events` sem `capacity` e registrar a resposta `400` com detalhes da validação Joi.
- [ ] Criar um evento válido de capacidade `2`; registrar a resposta `201` e o ID gerado.
- [ ] Inscrever dois participantes nesse evento com `POST /events/:id/register`; registrar ambas as respostas `201`.
- [ ] Tentar inscrever um terceiro participante; registrar a resposta `403` de evento lotado.
- [ ] Consultar `GET /events` e confirmar os dados do evento e `registrationCount: 2`.

## Registro e conclusão

- [ ] Salvar a coleção de requisições do cliente HTTP utilizado para permitir a reprodução.
- [ ] Registrar os resultados reais e as evidências dos testes em um arquivo próprio, por exemplo `RESULTADOS_TESTES.md`.
- [ ] Corrigir eventuais problemas encontrados e repetir os cenários afetados.
- [ ] Revisar o checklist de entrega da última página do PDF.
- [ ] Fazer um novo commit com sua parte e atualizar o status da etapa 5 no README.
- [ ] Enviar o commit da etapa 5 ao repositório do GitHub para a entrega final.

Use um evento recém-criado para executar o roteiro, pois o SQLite preserva inscrições de execuções anteriores. Não marque os itens como concluídos antes de executá-los.
