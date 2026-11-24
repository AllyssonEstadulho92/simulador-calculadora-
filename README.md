# Simulador Salarial Mensal — desenvolvimento 0.2.0

Projeto Móvel e Computador | Especificação funcional 1.0 | 24/11/2026.

**Não é uma aplicação salarial operacional.** O HTML aprovado 0.1 foi preservado byte a byte; não está ligado ao motor. O motor é uma biblioteca JavaScript independente, sem dependências externas, armazenamento ou transmissão de dados. O pacote contém apenas dados sintéticos. Código de desenvolvimento destinado ao GitHub; sem publicação da aplicação.

## Executar localmente

Com Node.js 22 ou superior, abrir a pasta do projeto e executar:

```sh
npm test
npm run demo
```

Não é necessário instalar dependências. O demo usa uma tabela fictícia; não serve para calcular o vencimento real. Para ver o design, abrir `index.html` num browser. Este continua a ser o protótipo demonstrativo 0.1, não uma calculadora interativa real.

API: `calculate(input)` e `compareScenarios(baseline, scenario)` em `src/payroll.mjs`. Usar `examples/fixture.mjs` apenas como esquema sintético; substituir integralmente as fontes, vigências, dados e tabelas por dados validados antes de qualquer utilização real. Consultar `docs/ENGINE_API.md`, `docs/PAYROLL_RULES.md` e `docs/TEST_REPORT.md`.

O resultado líquido é `null` quando existem bloqueios. Os totais `known*` representam apenas rubricas conhecidas, não uma previsão completa. Valores monetários em cêntimos inteiros; datas ISO; minutos inteiros; taxas em pontos base (1100 = 11%). Não introduzir recibos, dados reais, segredos ou informação fiscal pessoal no GitHub.
