# Cinco dias para estudar e apresentar

**Dia 1 — Problema e estados.** Instale com npm ci e execute npm run dev. Experimente todos os cenários. Desenhe os estados inicial, carregando, sucesso, vazio, erro e cancelado. Explique por que vazio não é erro e por que os dados antigos precisam de aviso.

**Dia 2 — TypeScript e dados externos.** Leia api.ts. Explique a diferença entre um tipo estático e validar unknown em tempo de execução. Execute npm test. Acrescente um teste para um cliente ausente e veja-o reprovar caso a validação seja removida. Não altere o código principal sem entender o teste.

**Dia 3 — Concorrência.** Siga o caminho de AbortController e generation. Cancele uma consulta lenta e carregue um resultado vazio. Explique por que respostas antigas não podem substituir uma consulta mais recente. Diferencie cancelamento, timeout e HTTP 503.

**Dia 4 — Interface e validação.** Execute npm run test:e2e. Use apenas Tab, Shift+Tab e Enter. Confira foco visível, leitura da tabela, zoom de 200% e tela estreita. Se disponível, teste com NVDA ou VoiceOver e registre o resultado real; não declare conformidade completa.

**Dia 5 — Apresentação.** Grave de 30 a 60 segundos: sucesso → HTTP 503 com dados preservados → recuperação. Explique o problema, mostre o código responsável e mencione que a API é simulada. Revise o texto do LinkedIn; publique somente depois de executar e compreender o projeto.

## Respostas para treinar em entrevista
- Por que não apagar a lista quando a consulta falha?
- O que acontece se o usuário cancela e faz outra consulta?
- Por que TypeScript não substitui a validação da resposta?
- O que mudaria ao trocar a simulação por fetch de uma API real?
- O que ainda falta para produção? Autenticação, observabilidade, contrato real, políticas de cache, cobertura de navegadores e validação de acessibilidade com usuários.

## Publicação manual no GitHub
Crie um repositório vazio chamado pedidos-resilientes. Extraia este pacote e abra o terminal na pasta do projeto:

```bash
git init
git add .
git commit -m "feat: demonstrate resilient order queries"
git branch -M main
```
Adicione o endereço real do seu repositório como origin e execute git push -u origin main. Confira os arquivos antes do envio. Descrição sugerida: “React and TypeScript lab for timeout, cancellation, data validation and manual recovery from simulated API failures.”

Topics sugeridos: react typescript frontend error-handling abortcontroller playwright vitest portfolio.
