# Decisões técnicas propostas — 24/11/2026

- D01: repositório público; nenhuma alteração remota efetuada. Ramo num repositório público não é privado. Propor desenvolvimento local ou repositório privado, mediante autorização.
- D02: protótipo HTML/CSS/JS sem dependências nem serviços externos; decisão apenas para avaliação visual, não compromisso de stack do produto.
- D03: cinco áreas de navegação, com menu inferior em ecrã estreito e lateral em desktop. Depende de aprovação.
- D04: dados fictícios; nunca interpretar números do protótipo como previsão. Dados reais não devem ir para o código Git.
- D05: usar minutos inteiros e valores monetários em decimal/racional; distinguir arredondamento por rubrica, contribuição e retenção legal. Proposta não implementada.
- D06: estado incompleto ou estimativa quando regras/dados essenciais estiverem ausentes. Não assumir 0 para variável desconhecida.
- D07: separar competência, período processado e pagamento; regras fiscais por data de pagamento, laborais por data de ocorrência, com rastreabilidade.

## Decisões 0.2.0

- D08 (autorizada): desenvolvimento local, sem escrita remota; HTML aprovado preservado integralmente.
- D09 (decisão técnica): módulos ECMAScript, execução Node 22+, sem dependências, sem persistência e sem rede nesta fase. Não fixa a futura arquitetura de armazenamento.
- D10 (decisão técnica): dinheiro em cêntimos inteiros e racional BigInt intermédio; arredondamento por rubrica diária à unidade de cêntimo, metade afastada de zero; SS sobre total mensal. Critério de arredondamento ainda requer calibração com recibos. IRS ordinário arredonda para euro inferior.
- D11 (segurança funcional): nenhum IRS oficial pré-carregado; tabela sintética só nos exemplos e testes. Bloqueio para novembro/dezembro de 2026, retenção autónoma, retroativos e outros dados essenciais incompletos. Metadados de regra são declarações do chamador, não prova de autenticidade.
- D12 (escopo): cálculo de duração noturna suportado; processamento por data civil exige repartição explícita e verificação DST. Feriados calculados segundo versão atual do calendário, não garantia de legislação futura.
- D13 (escopo): fecho por dia de corte de cada rubrica, mês seguinte se posterior ao corte, mediante configuração explícita. Não integra transferências de meses anteriores, nem confirma automaticamente pagamento no dia 25.
- D14 (escopo): as ausências requerem classificação expressa; o desconto proporcional por hora só é feito com regra confirmada e sem estado incompatível. Não simula prestações sociais.
