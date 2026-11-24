# Arquitetura proposta (não implementada)

Não existe arquitetura anterior no repositório identificado. A proposta mantém o motor independente da UI. Tecnologia definitiva a decidir após aprovação, sem dependências externas no protótipo.

| Domínio | Responsabilidade |
|---|---|
| Perfil | Contrato e versões efetivas por data; perfil fiscal separado |
| Calendário | Feriados versionados e horário previsto, realizado e intervalos |
| Assiduidade | Classificar minutos, ausência remunerada/não remunerada e horas autorizadas |
| Motor salarial | Rubricas, cálculo racional/decimal e arredondamento explícito |
| Fiscal | Bases IRS/SS distintas, tabela por região e data de pagamento, retenções separadas |
| Regras contratuais | Majorações, acumulação, alimentação, fecho; fonte e validação |
| Processamento | Livro de rubricas com data de competência, corte e pagamento; transferências idempotentes |
| Recibos e reconciliação | Comparação por rubrica, depósito bancário e cartão, diferenças e evidência |
| Histórico e auditoria | Snapshots imutáveis de cálculo, regras, dados e revisões |

Modelo proposto: ProfileVersion, ScheduleDay, WorkInterval, Absence, RuleVersion, PayrollItem, ProcessingCycle, CalculationSnapshot, ReceiptItem, Payment, Reconciliation, AuditEvent. Identificadores estáveis e ligação de rubricas a ocorrências; proibir duplicação de origem + tipo + período. Manter intervalos com data local e zona horária; cruzamentos de meia-noite e mudança de hora são casos de teste. Separar calendário de classificação laboral (domingo não implica descanso).

UI: Resumo, Calendário, Processamento (inclui cenários), Conferência (inclui histórico/relatórios), Perfil (inclui regras). A disposição é proposta e depende de aprovação.

Segurança: dados de teste sintéticos; nenhum recibo em Git; sem integrações externas no protótipo. Avaliar armazenamento local, exportação e backup cifrado, autenticação/autorização caso haja sincronização, modelo de ameaças e retenção antes do produto. Não considerar armazenamento de browser automaticamente cifrado.

## Implementação parcial 0.2.0

- `src/decimal.mjs`: aritmética racional BigInt, cálculo horário, arredondamento em cêntimos, piso de euros; limites de entrada.
- `src/calendar.mjs`: calendário civil ISO, feriados e intervalos; duração por relógio local, sem resolução automática DST.
- `src/rules.mjs`: cálculo suplementar por segmentos, referência legal e fórmula de tabela ordinária fornecida externamente.
- `src/payroll.mjs`: cálculo mensal puro; uma ocorrência por data; rubricas rastreáveis com competência e mês de pagamento; estados de fiabilidade; comparação de cenários.
- `examples/`: dados exclusivamente sintéticos; `tests/`: testes automáticos Node sem dependências.
- `index.html`: protótipo aprovado, inalterado. Não importa os módulos. Nenhuma camada de armazenamento, autenticação, backend, importação, PWA ou rede implementada.

As estruturas de histórico, versões persistidas, e reconciliação descritas acima continuam propostas. A versão de perfil cobre um mês inteiro; mudanças intra-mês exigem futura regra de proporcionalidade. Não existe livro persistente de transferências nem deduplicação entre meses. O motor não garante validade legal apenas por receber metadados de confirmação.
