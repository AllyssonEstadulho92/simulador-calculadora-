# Matriz preliminar de regras e fontes — 24/11/2026

Estado: pesquisa inicial, não integração nem validação exaustiva. As referências seguintes suportam o desenho do motor; cada regra executável precisará de testes, vigência explícita e revisão de exceções.

| ID | Regra | Fonte | Estado |
|---|---|---|---|
| CT-271 | Valor horário = remuneração mensal × 12 / (52 × período normal semanal) | Código do Trabalho, art. 271.º | Confirmada em fonte; não implementada |
| CT-234 | Feriados obrigatórios nacionais, fixos e móveis | Código do Trabalho, art. 234.º | Confirmada em fonte; calendário generalizado pendente |
| CT-268 | Suplementar até 100 h anuais: dia útil +25% primeira hora/fração, +37,5% subsequentes; descanso/feriado +50%. Acima de 100 h: +50%, +75%, +100% respetivamente. Redação de 01/05/2023. | Código do Trabalho, art. 268.º | Confirmada em fonte; casos fronteira e regras contratuais pendentes |
| CT-269 | Trabalho normal em feriado, em empresa não obrigada a suspender atividade: descanso de metade das horas ou acréscimo de 50%, escolha do empregador. | Código do Trabalho, art. 269.º | Confirmada em fonte; aplicação individual pendente |
| SS-53 | Regime geral 11% trabalhador, sobre base contributiva aplicável | Código contributivo, arts. 46.º, 53.º | Confirmada em fonte; exceções pendentes |
| IRS-2026 | Tabelas continente a partir de 01/01/2026 | Despacho 233-A/2026 | Fonte localizada; tabelas, retificações e regimes por validar integralmente |
| IRS-2026-NOV | Redução temporária em novembro para rendimentos abrangidos, em regra para 50% da retenção apurada; exceções de rendimentos e retificações até dezembro. | Despacho 12523-A/2026 | Fonte localizada; implementação pendente |
| IRS-ROUND | Retenção arredondada à unidade de euro inferior nos termos do art. 99.º-E do CIRS | Código do IRS, art. 99.º-E | Confirmada em fonte; casos específicos pendentes |
| ALIM-2026 | Referência pública 6,15 €/dia com efeitos 01/01/2026; em vales limite fiscal acrescido de 70% | Portaria 51-B/2026/1 e CIRS art. 2.º | Fontes identificadas; arredondamento do limite e incidência contributiva a validar |
| DOENCA | Prestação da Segurança Social separada do salário | Segurança Social, Subsídio de doença | Fonte localizada; elegibilidade, espera e fórmula pendentes |
| CONTRATO | Domingo normal, fecho, dia 25, alimentação e restantes complementos | Contrato, IRCT, recibos e regras da entidade empregadora | Por confirmar; sem valores pessoais neste pacote |

## Ligações oficiais
- CT art. 268.º: https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2009-34546475-211441912
- CT art. 269.º: https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2009-34546475-211441913
- CT art. 271.º: https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2009-34546475-46750775
- CT feriados: https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2009-34546475-46746675
- Segurança Social: https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2009-34514575-43545575
- IRS 2026: https://diariodarepublica.pt/dr/detalhe/despacho/233-a-2026-998488151
- IRS novembro: https://diariodarepublica.pt/dr/detalhe/despacho/12523-a-2026-1180337885
- CIRS: https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2014-70048167-153141041
- CIRS alimentação: https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs2.aspx
- Portaria alimentação: https://diariodarepublica.pt/dr/detalhe/portaria/51-b-2026-1031110274
- Doença: https://www.seg-social.pt/ptss/pssd/menu/trabalho/cuidados-doenca/subsidio-doenca

## Estado executável 0.2.0 — verificação em 24/11/2026

Versão de implementação `PT-2026-preview.1`. Referências oficiais reconsultadas: CT arts. 234, 268, 269 e 271; Código contributivo art. 53; CIRS arts. 99-C e 99-E; despachos 233-A/2026 e 12523-A/2026. A matriz anterior é histórica; prevalece o estado abaixo.

| Regra | Estado no motor | Limitação |
|---|---|---|
| CT-271 | Implementada fórmula racional | Base remuneratória depende da confirmação do perfil; outras componentes relevantes devem ser analisadas |
| CT-234 | Calendário nacional fixo/móvel, feriados adicionais | Não automatiza exceções regionais/locais, deslocações do feriado ou mudanças legais futuras |
| CT-268 | Segmentação por primeiro período de 60 min e limite 6000 min anuais; remuneração base da hora extra + majoração | Regras mais favoráveis, limites de prestação, regimes especiais e granularidade de arredondamento por confirmar; requer classificação e autorização |
| CT-269 | Acréscimo normal em feriado a partir de 50% ou descanso de metade, mediante regra expressa | Empresa legalmente dispensada de suspender atividade e escolha da compensação requerem confirmação |
| SS-53 | Taxa parametrizada, bases explícitas e arredondamento | 11% só regime geral; exceções e incidência de cada rubrica por confirmar |
| IRS-ROUND | Piso de euro no cálculo ordinário | Não cobre retenções autónomas ou recálculo de retroativos |
| IRS-2026 | Fórmula marginal com parcela fixa e dedução por dependente | Tabelas oficiais não carregadas; fórmulas variáveis e regimes especiais por implementar |
| IRS-2026-NOV | Bloqueio explícito do líquido em novembro/dezembro de 2026 | Ajustamentos e retificações não implementados; bloqueio conservador, não significa que todos os pagamentos de dezembro tenham ajuste |
| IRS-AUT | Bloqueio para suplementar, subsídios e retroativos sujeitos a retenção distinta | CIRS art. 99-C; implementar regra autónoma antes do uso real |
| ALIM-2026 | Limites IRS/SS fornecidos separadamente, canal banco/cartão, elegibilidade explícita | Nenhum limite real pré-carregado; vigência e arredondamento por validar |
| CONTRATO | Taxas fim de semana, acumulação, descontos, alimentação e fecho exigem configuração | Nenhuma regra da entidade empregadora assumida |
| DOENCA | Ausência remunerada ou não, explicitamente classificada | Prestação de doença não calculada nem integrada no salário |

Fontes adicionais: CIRS art. 99-C https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs99c.aspx ; art. 99-E https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs99e.aspx ; CT art. 271 https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2009-34546475-46750775 .
