import {academicUnits, type SaveData} from './data.ts';
export interface PersistenceService {load():SaveData|null;save(data:SaveData):void;clear():void}
export function isValidSave(value:unknown):value is SaveData {
 if(!value||typeof value!=='object')return false;
 const s=value as SaveData,c=s.character;
 return s.version===1&&!!c&&typeof c.nickname==='string'&&c.nickname.trim().length>0&&c.nickname.length<=20&&academicUnits.some(u=>u.id===c.faculty)&&
 [c.body,c.skin,c.hair,c.hairColor,c.eyes,c.outfit].every((n,i)=>Number.isInteger(n)&&n>=0&&n<[2,6,5,6,3,3][i])&&Number.isInteger(c.level)&&c.level>=1&&
 Number.isFinite(s.x)&&s.x>=32&&s.x<=1504&&Number.isFinite(s.y)&&s.y>=32&&s.y<=1120&&['new','accepted','collected','complete'].includes(s.quest)&&Number.isInteger(s.coins)&&s.coins>=0&&typeof s.savedAt==='string';
}
export class LocalPersistence implements PersistenceService {
 private key='mahidol-life.v1';
 load(){try{const value:unknown=JSON.parse(localStorage.getItem(this.key)??'null');return isValidSave(value)?value:null;}catch{return null;}}
 save(data:SaveData){localStorage.setItem(this.key,JSON.stringify(data));}
 clear(){localStorage.removeItem(this.key);}
}
export const persistence:PersistenceService=new LocalPersistence();
