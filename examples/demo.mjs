import {calculate} from '../src/payroll.mjs';
import {fixture} from './fixture.mjs';
const result=calculate(fixture());
console.log('DEMONSTRAÇÃO FICTÍCIA — NÃO UTILIZAR PARA PROCESSAMENTO REAL.');
console.log(JSON.stringify({status:result.status,month:result.month,attendance:result.attendance,totals:result.totals},null,2));
