# Texto sugerido — revisar após estudar e executar

Uma consulta falhou. Precisamos apagar tudo que a pessoa já estava vendo?

No estudo Pedidos Resilientes, explorei esse problema em uma interface de acompanhamento de pedidos com React e TypeScript.

A tela mantém a última resposta válida quando uma atualização falha, informa que os dados podem estar desatualizados e oferece uma nova tentativa manual. Também diferencia uma lista vazia de um erro, permite cancelar a consulta e interrompe respostas que ultrapassam o limite de espera.

As decisões principais foram separar a camada de dados da interface, validar a resposta em tempo de execução e impedir que uma consulta antiga sobrescreva o estado atual.

A validação incluiu 13 testes da camada de dados e 6 testes em Chromium: recuperação após HTTP 503, preservação da lista, timeout, cancelamento, formato inválido e operação por teclado em tela estreita. O build de produção também passou.

É um laboratório de portfólio com dados fictícios e API simulada, sem operações comerciais reais. Testes com leitor de tela e integração com um backend real são próximos passos; não estou declarando conformidade completa de acessibilidade.

No vídeo: consulta bem-sucedida → falha com contexto preservado → recuperação.

#React #TypeScript #Frontend #TestesDeSoftware #DesenvolvimentoWeb

---
Antes de publicar: execute o projeto, ajuste o texto ao que consegue explicar e inclua o link real do repositório depois de criá-lo. Este material não foi publicado automaticamente.
