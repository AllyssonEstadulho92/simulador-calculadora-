// Exact rational arithmetic in cents. No binary floating-point money operations.
export function integer(x, name='valor', min=0, max=Number.MAX_SAFE_INTEGER) {
  if (!Number.isSafeInteger(x)||x<min||x>max) throw new RangeError(`${name}: inteiro entre ${min} e ${max} obrigatório`); return x;
}
export const q=(n,d=1n)=>{n=BigInt(n);d=BigInt(d);if(d<=0n)throw new RangeError('Denominador inválido');return {n,d}};
export const add=(a,b)=>q(a.n*b.d+b.n*a.d,a.d*b.d);
export const mul=(a,n,d=1n)=>q(a.n*BigInt(n),a.d*BigInt(d));
export const round=a=>{const n=a.n<0n?-a.n:a.n;const z=(2n*n+a.d)/(2n*a.d);const result=Number(a.n<0n?-z:z);if(!Number.isSafeInteger(result))throw new RangeError('Montante fora do intervalo');return result};
export const floorEuros=a=>{if(a.n<=0n)return 0;const result=Number(a.n/(100n*a.d)*100n);return integer(result,'retenção')};
export const money=(x,name='cêntimos')=>integer(x,name,0,1000000000);
export const bps=(x,name='taxa')=>integer(x,name,0,10000);
export function hourly(monthlyCents,weeklyMinutes){money(monthlyCents);integer(weeklyMinutes,'minutos semanais',1,10080);return q(BigInt(monthlyCents)*12n*60n,52n*BigInt(weeklyMinutes))}
export const minutesValue=(hour,minutes)=>mul(hour,integer(minutes,'minutos',0,1000000),60);
