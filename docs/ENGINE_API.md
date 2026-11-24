# API do motor 0.2.0 (prévia técnica)

`calculate(input)` é síncrono, puro e devolve um objeto serializável em JSON. `compareScenarios(a,b)` compara dois registos independentes do mesmo mês sem alterar entradas. Ver `examples/fixture.mjs` para um exemplo completo, estritamente sintético.

## Entrada e convenções

- `month`: YYYY-MM; `profile`: baseCents, weeklyMinutes, fullMonth, fiscalKey, dependents, metadados de fonte/vigência; versão única durante todo o mês.
- `days`: um por data civil, com status (`work`, `rest`, `vacation`, `holiday`, `sick`, `absence`, `training`, `compensatory`, `unfilled`), plannedMinutes, actualMinutes ou actualShift, durationConfirmed, normalMinutes, overtimeMinutes, unpaidMinutes, paidAbsenceMinutes, mealEligible. Exige `normal + overtime = actual` e `normal + ausências pagas + não pagas = planned`. As férias e folgas nunca geram desconto automático; classificações contraditórias bloqueiam.
- `actualShift`: start/end HH:MM, nextDay explícito se necessário, breaks (start/end/nextDay/paid). A função `duration()` distingue pausas remuneradas e não remuneradas. Cálculo de tempo de relógio, sem resolver DST. Turnos que cruzem meia-noite exigem repartição civil para o processamento mensal.
- `annualOvertimeBeforeMinutes`: acumulado anual prévio; `overtimeKind`: normal/rest/holiday; `overtimeAuthorized`: confirmação. Não é um validador dos limites de trabalho suplementar.
- `rules`: `confirmed`, `source`, `version`, `from`, `to` opcional em cada regra. `cutoff.days`: dia 1–31 por categoria, `null` significa processamento no próprio mês, ausência de propriedade significa regra em falta. `weekend`: saturdayBps, sundayBps, holidayStack booleano. `holiday`: applicable, mode pay/rest, rateBps. `meal`: dailyCents, channel bank/card, irsExemptCents, ssExemptCents. `ss`: rateBps. `absence`, `overtime`, `rounding`: confirmação da aplicação da regra. `irsTable` é perfil específico, `validated`, `source`, `version`, `profileKey`, `from`, `to`, `rows`: upTo (cêntimos, último null), rateBps, deductionCents, perDependentCents. Apenas fórmula ordinária de abatimentos fixos, não tabelas complexas.
- `payment`: data no mês processado e metadados de confirmação. Não deduz data a partir do dia 25.
- `extras`: lista explícita de rubricas com ID único, kind (extra/vacationBonus/christmasBonus/night/shift/retroactive), date, cents, irs e ss booleanos, source, confirmed. Não calcula automaticamente elegibilidade, valor ou subsídios já pagos entre meses.
- `extrasComplete`, `previousTransfersComplete`, `otherDeductionsCents`: confirmação de completude. Transferências anteriores não vazias bloqueiam o líquido até integração.

## Resultado

`lines`: ID, tipo, data, competência, mês de pagamento, canal, cêntimos, bases IRS/SS, grupo de retenção e fonte. Rubricas diárias arredondadas a cêntimos; componentes de retenção não suportadas bloqueiam cálculo líquido. `attendance` contém minutos previstos, realizados (incluindo pausas pagas), ausências, suplementares e por realizar (não compensa faltas com suplementar), domingos/feriados, alimentação e saldo anual; `compensatoryMinutes` expressa metade dos minutos normais elegíveis. `totals.known*` são montantes parciais conhecidos. `bankNetCents` é null se incompleto. `knownTransferCents` é soma bruta assinada, não líquido a receber. `pending`, `warnings`, `limitations` explicam bloqueios.

Estados: Incompleta, Estimativa, Calculada. Conferida/Reconciliada ainda não implementados. Inputs confirmados são declarações do chamador, não autenticação de fontes. Nenhuma previsão oficial sem calibração e validação. Dados inválidos estruturais lançam exceções; a futura interface terá de as tratar.
