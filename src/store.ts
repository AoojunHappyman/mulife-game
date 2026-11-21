import {create} from 'zustand';
import {defaultCharacter,spawn,advanceQuest,type Character,type SaveData,type QuestStage} from './data';
import {persistence} from './persistence';
type Screen='menu'|'creator'|'game';
interface State {screen:Screen;character:Character;quest:QuestStage;coins:number;position:{x:number;y:number};dialogue:null|{name:string;text:string};nearby:string;paused:boolean;notice:string;saveExists:boolean;music:number;sound:number;set:(patch:Partial<State>)=>void;customize:(patch:Partial<Character>)=>void;start:()=>void;resume:()=>void;save:()=>void;questEvent:(event:'talk'|'collect')=>void}
export const useStore=create<State>((set,get)=>({screen:'menu',character:{...defaultCharacter},quest:'new',coins:0,position:spawn,dialogue:null,nearby:'',paused:false,notice:'',saveExists:!!persistence.load(),music:.25,sound:.5,
 set:patch=>set(patch),customize:patch=>set({character:{...get().character,...patch}}),
 start:()=>{set({screen:'game',quest:'new',coins:0,position:{...spawn},paused:false,dialogue:null,character:{...get().character,nickname:get().character.nickname.trim(),level:1}});get().save();},
 resume:()=>{const data=persistence.load();if(data)set({screen:'game',character:data.character,position:{x:data.x,y:data.y},quest:data.quest,coins:data.coins,paused:false,dialogue:null});else set({saveExists:false,notice:'This save could not be loaded. Start a new story.'});},
 save:()=>{const s=get();const data:SaveData={version:1,character:s.character,...s.position,quest:s.quest,coins:s.coins,savedAt:new Date().toISOString()};try{persistence.save(data);set({saveExists:true,notice:'Your story is saved on this device.'});}catch{set({notice:'Saving is unavailable. Please allow browser storage.'});}},
 questEvent:event=>{const s=get(),next=advanceQuest(s.quest,event);set({quest:next,...(next==='complete'&&s.quest!=='complete'?{coins:s.coins+100,character:{...s.character,level:2}}:{})});get().save();},
}));
