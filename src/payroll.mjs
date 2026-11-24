import {integer,money,bps,q,mul,round,hourly,minutesValue} from './decimal.mjs';
import {monthDates,date,holidays,duration} from './calendar.mjs';
import {RULE_VERSION,sources,overtime,ordinaryIRS} from './rules.mjs';
export {hourly,round,duration,holidays,monthDates,overtime,ordinaryIRS};
const sum=(a,f)=>a.reduce((s,x)=>s+f(x),0);
const allowed=['work','rest','vacation','holiday','sick','absence','training','compensatory','unfilled'];
const types=['base','absence','weekend','holiday','overtime','meal','extra','vacationBonus','christmasBonus','night','shift','retroactive'];
const special=['overtime','vacationBonus','christmasBonus','retroactive'];
function confirmed(rule,when){return rule?.confirmed===true&&typeof rule.source==='string'&&!!rule.source.trim()&&typeof rule.version==='string'&&!!rule.version.trim()&&date(rule.from)&&rule.from<=when&&(!rule.to||(date(rule.to)&&when<=rule.to));}
export function nextMonth(m){const d=date(m+'-01');d.setUTCMonth(d.getUTCMonth()+1);return d.toISOString().slice(0,7)}
// Pure, JSON-compatible output. No I/O, no storage, no implicit contract values.
// Input daily records are one per civil date. Split midnight shifts for premiums and confirm DST separately.
export function calculate(input){
 const {month,profile={},days=[],rules={},payment={},extras=[]}=input; const calendar=monthDates(month),year=Number(month.slice(0,4));
 if(year<2026)throw new RangeError('Esta versão laboral destina-se a 2026 em diante; histórico anterior requer versão própria');
 const pending=new Set(),estimated=new Set(),lines=[],ids=new Set(),byDate=new Map();
 const issue=x=>pending.add(x);const estimate=x=>estimated.add(x);
 if(year!==2026)issue('Legislação após 2026 ainda não validada');
 if(!Array.isArray(days)||!Array.isArray(extras))throw new TypeError('Listas de dias e complementos obrigatórias');
 const cal=holidays(year,input.extraHolidays??[]);
 const base=profile.baseCents==null?null:money(profile.baseCents,'vencimento base');
 const weekly=profile.weeklyMinutes==null?null:integer(profile.weeklyMinutes,'horário semanal',1,10080);
 if(base===null||weekly===null)issue('Vencimento ou horário semanal em falta');
 if(!confirmed(profile,calendar[0])||!confirmed(profile,calendar.at(-1)))issue('Perfil mensal e vigência não confirmados; alteração a meio do mês exige apuramento próprio');
 if(profile.fullMonth!==true)issue('Admissão, cessação ou mês parcial não validado');
 const hour=base!==null&&weekly!==null?hourly(base,weekly):null;
 const refDate=payment.date??null;if(refDate!==null){date(refDate);if(!refDate.startsWith(month))throw new RangeError('Pagamento deve corresponder ao mês processado')}
 if(!refDate||!confirmed(payment,refDate))issue('Data de pagamento não confirmada');
 if(!confirmed(rules.cutoff,calendar.at(-1)))issue('Regras de fecho salarial não confirmadas');
 const route=(kind,day)=>{if(kind==='base')return month;const c=rules.cutoff?.days?.[kind];if(c===null)return month;if(c===undefined){issue(`Fecho por confirmar: ${kind}`);return null}integer(c,'dia de corte',1,31);return Number(day.slice(8))>Math.min(c,calendar.length)?nextMonth(month):month};
 function addLine(id,kind,day,cents,{channel='bank',irs=true,ss=true,irsGroup=special.includes(kind)?kind:'ordinary',irsCents,ssCents,source}={}){
  if(typeof id!=='string'||!id.trim()||ids.has(id))throw new Error(`Rubrica duplicada ou sem ID: ${id}`);ids.add(id);if(!types.includes(kind))throw new Error('Tipo de rubrica inválido');date(day);integer(cents,'rubrica',-1000000000,1000000000);
  const l={id,kind,date:day,competence:day.slice(0,7),paymentMonth:route(kind,day),cents,channel,irsGroup,irsCents:irsCents??(irs?cents:0),ssCents:ssCents??(ss?cents:0),source};lines.push(l);return l;
 }
 if(base!==null)addLine('base:'+month,'base',calendar[0],base,{source:profile.source??'Por confirmar'});
 for(const d of days){date(d.date);if(!calendar.includes(d.date)||byDate.has(d.date))throw new Error(`Dia duplicado ou fora do mês: ${d.date}`);byDate.set(d.date,d)}
 let planned=0,worked=0,normalWorked=0,unpaid=0,paidAbsence=0,ot=0,unclassified=0,compensatoryHalfMinutes=0,sundays=0,holidayDays=0,mealDays=0;
 let annual=input.annualOvertimeBeforeMinutes==null?null:integer(input.annualOvertimeBeforeMinutes,'suplementar anual anterior',0,600000);
 for(const day of calendar){const d=byDate.get(day);if(!d||d.status==='unfilled'){issue(`Dia por preencher: ${day}`);continue}if(!allowed.includes(d.status))throw new Error('Estado desconhecido');
  const p=d.plannedMinutes==null?null:integer(d.plannedMinutes,'previstos',0,1440);if(p===null)issue(`Horário previsto em falta: ${day}`);else planned+=p;
  const actual=d.actualMinutes==null?(d.actualShift?duration(d.actualShift).workMinutes:null):integer(d.actualMinutes,'realizados',0,1440);
  if(d.actualShift&&d.actualMinutes!=null&&duration(d.actualShift).workMinutes!==actual)throw new Error('Duração realizada incoerente');
  if(d.actualShift?.nextDay)issue(`Turno noturno ${day}: repartir por data civil para classificar majorações`);
  if(actual===null){issue(`Horário realizado em falta: ${day}`);continue}worked+=actual;
  if(d.durationConfirmed!==true)estimate(`Duração não confirmada: ${day}`);
  const normal=d.normalMinutes==null?null:integer(d.normalMinutes,'horas normais',0,actual);
  const extra=d.overtimeMinutes==null?null:integer(d.overtimeMinutes,'suplementares',0,actual);
  if(normal===null||extra===null||normal+extra!==actual){issue(`Classificação de trabalho incompleta: ${day}`);continue}ot+=extra;normalWorked+=normal;
  const u=d.unpaidMinutes==null?null:integer(d.unpaidMinutes,'ausência não remunerada',0,1440),r=d.paidAbsenceMinutes==null?null:integer(d.paidAbsenceMinutes,'ausência remunerada',0,1440);
  if(u===null||r===null||p===null||normal+u+r!==p){issue(`Assiduidade não reconciliada: ${day}`);unclassified+=p===null?0:Math.max(0,p-normal);}
  else{unpaid+=u;paidAbsence+=r;if(u){if(['vacation','rest','holiday','compensatory'].includes(d.status)){issue(`Ausência não remunerada incompatível com o estado: ${day}`)}else if(!confirmed(rules.absence,day)||!hour)issue(`Desconto de ausência por validar: ${day}`);else addLine(`absence:${day}`,'absence',day,-round(minutesValue(hour,u)),{source:rules.absence.source})}}
  const dow=date(day).getUTCDay(),isHoliday=Object.hasOwn(cal,day);if(actual>0&&dow===0)sundays++;if(actual>0&&isHoliday)holidayDays++;
  if(normal>0&&['rest','vacation','sick','absence','compensatory'].includes(d.status))issue(`Estado incompatível ou misto a esclarecer: ${day}`);
  if(normal&&isHoliday){const h=rules.holiday;if(!hour||!confirmed(h,day)||h.applicable!==true||!['pay','rest'].includes(h.mode))issue(`Compensação de feriado por confirmar: ${day}`);else if(h.mode==='pay'){const rate=integer(h.rateBps,'majoração feriado',5000,10000);addLine(`holiday:${day}`,'holiday',day,round(mul(minutesValue(hour,normal),rate,10000)),{source:h.source})}else compensatoryHalfMinutes+=normal;}
  if(normal&&(dow===0||dow===6)){const w=rules.weekend;const key=dow===0?'sundayBps':'saturdayBps';if(!hour||!confirmed(w,day)||w[key]==null)issue(`Majoração de fim de semana por confirmar: ${day}`);else if(isHoliday&&w.holidayStack===undefined)issue(`Acumulação de majorações por confirmar: ${day}`);else if(!isHoliday||w.holidayStack===true){const rate=bps(w[key]);if(rate)addLine(`weekend:${day}`,'weekend',day,round(mul(minutesValue(hour,normal),rate,10000)),{source:w.source})}}
  if(extra){const kind=d.overtimeKind;if(!hour||annual===null||!confirmed(rules.overtime,day)||d.overtimeAuthorized!==true||!['normal','rest','holiday'].includes(kind)||isHoliday!==(kind==='holiday')||(kind==='rest'&&d.status!=='rest')||(kind==='normal'&&d.status==='rest')){issue(`Suplementar, autorização ou acumulado por confirmar: ${day}`);annual=null;}else{const o=overtime(hour,extra,annual,0,kind);const l=addLine(`overtime:${day}`,'overtime',day,round(o.amount),{source:sources.overtime});l.segments=o.segments;annual=o.annualAfter}}
  if(typeof d.mealEligible!=='boolean')issue(`Elegibilidade de alimentação por confirmar: ${day}`);else if(d.mealEligible){mealDays++;const m=rules.meal;if(!confirmed(m,day)||!['bank','card'].includes(m.channel)||m.dailyCents==null||m.irsExemptCents==null||m.ssExemptCents==null){issue(`Alimentação ou limites por confirmar: ${day}`)}else{const cents=money(m.dailyCents);const i=Math.max(0,cents-money(m.irsExemptCents));const s=Math.max(0,cents-money(m.ssExemptCents));addLine(`meal:${day}`,'meal',day,cents,{channel:m.channel,irsCents:i,ssCents:s,source:m.source})}}
 }
 for(const x of extras){if(!['extra','vacationBonus','christmasBonus','night','shift','retroactive'].includes(x.kind)||!calendar.includes(x.date)||typeof x.irs!=='boolean'||typeof x.ss!=='boolean'||typeof x.source!=='string'||!x.source.trim())throw new Error('Complemento sem classificação, data ou fonte');if(x.confirmed!==true)issue(`Complemento não confirmado: ${x.id}`);if(x.kind==='retroactive')issue('Retroativos exigem recálculo fiscal por competência, não implementado');addLine(x.id,x.kind,x.date,money(x.cents),{irs:x.irs,ss:x.ss,source:x.source})}
 if(input.extrasComplete!==true)issue('Prémios, subsídios e acertos não confirmados como completos');
 if(input.previousTransfersComplete!==true)issue('Valores transitados anteriores não confirmados');
 // Prior month imports are not yet supported; a complete nonempty prior transfer list blocks net.
 if(input.previousTransfers?.length)issue('Integração de valores transitados anteriores ainda não implementada');
 const current=lines.filter(l=>l.paymentMonth===month),future=lines.filter(l=>l.paymentMonth===nextMonth(month)),unassigned=lines.filter(l=>l.paymentMonth===null);
 const grossBank=sum(current,l=>l.channel==='bank'?l.cents:0),card=sum(current,l=>l.channel==='card'?l.cents:0),ssBase=sum(current,l=>l.ssCents),irsBase=sum(current,l=>l.irsCents);
 let ss=null,irs=null;if(ssBase<0||irsBase<0||grossBank<0)issue('Base de incidência ou bruto negativo: revisão necessária');
 if(refDate&&confirmed(rules.ss,refDate)&&rules.ss.rateBps!=null&&ssBase>=0)ss=round(mul(q(ssBase),bps(rules.ss.rateBps),10000));else issue('Taxa contributiva por confirmar');
 if(current.some(l=>l.irsGroup!=='ordinary'&&l.irsCents!==0))issue('Retenção autónoma ou acertos exigem módulo fiscal próprio');
 else if(refDate&&irsBase>=0){try{irs=ordinaryIRS(irsBase,rules.irsTable,refDate,profile.fiscalKey,profile.dependents)}catch(e){issue(e.message)}}else issue('Retenção IRS por apurar');
 if(!confirmed(rules.rounding,calendar.at(-1)))estimate('Arredondamento por rubrica diária e SS mensal ainda por calibrar');
 if(input.otherDeductionsCents==null)issue('Outros descontos por confirmar');const other=input.otherDeductionsCents==null?null:money(input.otherDeductionsCents);
 if(ss!==null&&irs!==null&&other!==null&&grossBank-ss-irs-other<0)issue('Líquido negativo: requer revisão');
 const incomplete=pending.size>0;return {version:RULE_VERSION,month,paymentDate:refDate,status:incomplete?'Incompleta':estimated.size?'Estimativa':'Calculada',pending:[...pending],warnings:[...estimated],hourlyCents:hour?{numerator:hour.n.toString(),denominator:hour.d.toString(),rounded:round(hour)}:null,attendance:{planned,worked,unpaid,paidAbsence,overtime:ot,unclassified,remaining:Math.max(0,planned-normalWorked-paidAbsence-unpaid),sundays,holidayDays,mealDays,annualOvertimeAfter:annual,compensatoryHalfMinutes,compensatoryMinutes:compensatoryHalfMinutes/2},lines,totals:{knownBankGrossCents:grossBank,knownCardCents:card,knownSSBaseCents:ssBase,knownIRSBaseCents:irsBase,ssCents:ss,irsCents:irs,otherDeductionsCents:other,bankNetCents:incomplete?null:grossBank-ss-irs-other,knownTransferCents:sum(future,l=>l.cents),unassignedCents:sum(unassigned,l=>l.cents)},limitations:['Montantes parciais conhecidos não constituem previsão completa','Não valida limites legais de trabalho suplementar, mudanças de hora, retroativos ou retenções autónomas','Não substitui recibo oficial']};
}

// Compare independent snapshots; never modify the actual record.
export function compareScenarios(baseline,scenario){
 if(baseline.month!==scenario.month)throw new RangeError('Comparar o mesmo mês');
 const actual=calculate(baseline), simulated=calculate(scenario);
 const delta=(a,b)=>a===null||b===null?null:b-a;
 return {actual,simulated,difference:{bankGrossCents:delta(actual.totals.knownBankGrossCents,simulated.totals.knownBankGrossCents),bankNetCents:delta(actual.totals.bankNetCents,simulated.totals.bankNetCents),cardCents:delta(actual.totals.knownCardCents,simulated.totals.knownCardCents),ssCents:delta(actual.totals.ssCents,simulated.totals.ssCents),irsCents:delta(actual.totals.irsCents,simulated.totals.irsCents)},partial:actual.status==='Incompleta'||simulated.status==='Incompleta'};
}
