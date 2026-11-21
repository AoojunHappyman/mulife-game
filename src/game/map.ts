export const TILE=32,COLS=48,ROWS=36;
export interface MapObject {name:string;x:number;y:number;width:number;height:number;kind:'building'|'tree'|'pond'|'bench'|'sign';label?:string}
export const objects:MapObject[]=[
 {name:'academic',x:512,y:160,width:384,height:192,kind:'building',label:'MAHIDOL · LEARNING COMMONS'},
 {name:'cafeteria',x:1056,y:544,width:288,height:160,kind:'building',label:'SALAYA CAFÉ'},
 {name:'pond',x:160,y:512,width:256,height:160,kind:'pond'},
 {name:'sign',x:696,y:880,width:32,height:24,kind:'sign'},
 {name:'bench',x:544,y:608,width:64,height:24,kind:'bench'},
 {name:'bench',x:928,y:608,width:64,height:24,kind:'bench'},
 ...[[96,128],[224,192],[352,96],[1120,160],[1248,288],[1408,128],[96,352],[352,352],[1056,352],[1408,448],[96,800],[256,864],[432,752],[592,800],[960,832],[1248,864],[1408,1024],[160,1056],[416,1056],[1120,1056]].map(([x,y],i)=>({name:`tree-${i}`,x,y,width:32,height:24,kind:'tree' as const})),
];
export function terrain(){return Array.from({length:ROWS},(_,y)=>Array.from({length:COLS},(_,x)=>{
 if(x===0||y===0||x===COLS-1||y===ROWS-1)return 4;
 if((x>=22&&x<=26)||(y>=13&&y<=15)||(y>=22&&y<=24)||(y>=10&&y<=12&&x>=16&&x<=28)||(x>=33&&x<=41&&y>=21&&y<=24))return 2;
 return ((x*31+y*17)%13===0)?1:0;
}));}
// Standard orthogonal Tiled JSON. Terrain, collision objects and art are separate.
export function tiledMap(){return {width:COLS,height:ROWS,tilewidth:TILE,tileheight:TILE,infinite:false,orientation:'orthogonal',renderorder:'right-down',version:1.10,type:'map',tilesets:[{firstgid:1,name:'campus',tilewidth:32,tileheight:32,tilecount:5,columns:5,image:'campus-tiles',imagewidth:160,imageheight:32,margin:0,spacing:0}],layers:[{id:1,name:'Ground',type:'tilelayer',width:COLS,height:ROWS,x:0,y:0,opacity:1,visible:true,data:terrain().flat().map(n=>n+1)},{id:2,name:'Collisions',type:'objectgroup',x:0,y:0,opacity:1,visible:true,objects:objects.map((o,i)=>({id:i+1,name:o.name,type:o.kind,x:o.x,y:o.y,width:o.width,height:o.height,rotation:0,visible:true}))}]};}
