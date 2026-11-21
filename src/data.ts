export const academicUnits = [
  {id:'siriraj',short:'Siriraj',thai:'คณะแพทยศาสตร์ศิริราชพยาบาล',english:'Faculty of Medicine Siriraj Hospital',type:'Faculty'},
  {id:'rama',short:'Ramathibodi',thai:'คณะแพทยศาสตร์โรงพยาบาลรามาธิบดี',english:'Faculty of Medicine Ramathibodi Hospital',type:'Faculty'},
  {id:'ict',short:'ICT',thai:'คณะเทคโนโลยีสารสนเทศและการสื่อสาร',english:'Faculty of Information and Communication Technology',type:'Faculty'},
  {id:'engineering',short:'Engineering',thai:'คณะวิศวกรรมศาสตร์',english:'Faculty of Engineering',type:'Faculty'},
  {id:'science',short:'Science',thai:'คณะวิทยาศาสตร์',english:'Faculty of Science',type:'Faculty'},
  {id:'music',short:'Music',thai:'วิทยาลัยดุริยางคศิลป์',english:'College of Music',type:'College'},
] as const;
export type FacultyId = typeof academicUnits[number]['id'];
export interface FacultyIdentity {className:string;color:string;light:string;outfit:string;item:string;skill:string;quest:string;description:string;task:string}
export const identities:Record<FacultyId,FacultyIdentity> = {
 siriraj:{className:'Clinical Guardian',color:'#4767c9',light:'#e7ecff',outfit:'Guardian sportswear',item:'First-aid kit',skill:'Healing Hands',quest:'A little care goes a long way',description:'A kind heart. A steady hand. Make campus a little brighter.',task:'Collect the care package in the garden and bring it to Ploy.'},
 rama:{className:'Medical Innovator',color:'#9b63bc',light:'#f3e8fc',outfit:'Innovator sportswear',item:'Research tablet',skill:'Bright Diagnosis',quest:'An idea for tomorrow',description:'Connect curiosity with compassion. Discover a better tomorrow.',task:'Collect the research notes in the garden and bring them to Ploy.'},
 ict:{className:'Technomancer',color:'#438e9d',light:'#e0f3f3',outfit:'Technomancer sportswear',item:'Pocket computer',skill:'Digital Spark',quest:'Hello, campus!',description:'Find connections, solve puzzles, and write your own story.',task:'Collect the sensor module in the garden and bring it to Ploy.'},
 engineering:{className:'Inventor',color:'#bd5e4e',light:'#fbe9e1',outfit:'Inventor sportswear',item:'Mini toolkit',skill:'Quick Fix',quest:'Build a better day',description:'A pocket full of tools and a world full of possibilities.',task:'Collect the repair tools in the garden and bring them to Ploy.'},
 science:{className:'Researcher',color:'#b48a27',light:'#fcf2cf',outfit:'Researcher sportswear',item:'Field notebook',skill:'Keen Observation',quest:'Small wonders',description:'Look a little closer. Every leaf has a story to tell.',task:'Collect the leaf samples in the garden and bring them to Ploy.'},
 music:{className:'Bard',color:'#8c6eaf',light:'#f0e9fa',outfit:'Bard sportswear',item:'Pocket metronome',skill:'Campus Harmony',quest:'Find your rhythm',description:'Make friends, find your melody, and let the campus sing.',task:'Collect the music sheets in the garden and bring them to Ploy.'},
};
export const skinColors=['#f5d7b5','#eac39e','#d7a57c','#bb825b','#955d42','#704432'];
export const hairColors=['#624335','#292e3d','#b57b47','#e5c078','#985957','#8683af'];
export const hairNames=['Soft crop','Side part','Bob cut','Ponytail','Wavy'];
export const outfits=['University Uniform','Sportswear','Casual Outfit'];
export interface Character {nickname:string;faculty:FacultyId;body:number;skin:number;hair:number;hairColor:number;eyes:number;outfit:number;level:number}
export const defaultCharacter:Character={nickname:'Mali',faculty:'siriraj',body:0,skin:1,hair:0,hairColor:0,eyes:0,outfit:1,level:1};
export type QuestStage='new'|'accepted'|'collected'|'complete';
export interface SaveData {version:1;character:Character;x:number;y:number;quest:QuestStage;coins:number;savedAt:string}
export const spawn={x:784,y:1008};
export function advanceQuest(stage:QuestStage,event:'talk'|'collect'):QuestStage {
 if(stage==='new'&&event==='talk')return 'accepted';
 if(stage==='accepted'&&event==='collect')return 'collected';
 if(stage==='collected'&&event==='talk')return 'complete';
 return stage;
}
