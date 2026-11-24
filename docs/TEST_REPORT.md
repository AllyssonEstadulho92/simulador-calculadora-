# Relatório de testes 0.2.0 — 24/11/2026

Ambiente Node.js v22.16.0. Comando `npm test` (node --test), sem dependências. Ensaio final: 40 testes, 40 aprovados, 0 falhas, 0 ignorados. Dados sintéticos. Primeiro ensaio: 37/38; a expectativa do teste de transição do patamar anual estava incorreta. Com hora a 10 EUR, 30 min a 125% = 6,25; 30 min a 150% = 7,50; 60 min a 175% = 17,50; total 31,25 EUR. Corrigida a expectativa e adicionados testes de férias contraditórias e cenários isolados.

Cobertura: valor hora, aritmética e entradas inválidas, mês completo e bissexto, feriados móveis/municipais, pausas pagas, meia-noite, pausas sobrepostas, salário fixo, alimentação separada e bases distintas, domingo e feriado, descanso compensatório, trabalho suplementar, ausência, férias, baixa classificada, fecho, duplicados, IRS ordinário sintético, bloqueios fiscais 2026, perfil incompleto, subsídio explícito, dias em falta, determinismo, arredondamento por calibrar, transitados anteriores, ano futuro, cenário isolado.

`npm run demo`: execução concluída; resultados sintéticos base 1000 EUR, SS 110 EUR, IRS fictício 30 EUR, líquido 860 EUR, cartão 120 EUR; não são valores reais.

Regressão visual: `cmp` confirmou igualdade binária entre os dois HTML; SHA-256 em ambos 6f3c28295953a0d93b2ea560a0c0a1618c50451ef76d613e0b0fcd22b127669d. Não foi repetido teste de renderização nesta etapa, nem testada integração UI, persistência, WCAG, iPhone físico ou segurança de aplicação completa. Não foram efetuadas chamadas de rede pelo motor. Não foi executado teste com recibos ou tabelas oficiais integrais.

Logs completos em `docs/TEST_RESULTS.txt` e `docs/DEMO_RESULTS.txt`.
