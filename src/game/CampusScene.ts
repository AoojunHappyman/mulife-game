import Phaser from 'phaser';
import {useStore} from '../store';
import {defaultCharacter,identities} from '../data';
import {sound} from '../audio';
import {LayeredCharacter} from './sprites';
import {COLS,ROWS,TILE,objects,tiledMap} from './map';
export class CampusScene extends Phaser.Scene {
 private player!:LayeredCharacter;private body!:Phaser.Physics.Arcade.Image;private npcs:LayeredCharacter[]=[];
 private keys!:Record<string,Phaser.Input.Keyboard.Key>;private prompt!:Phaser.GameObjects.Text;private parcel!:Phaser.GameObjects.Container;private marker!:Phaser.GameObjects.Text;private lastSave=0;private lastPosition=0;
 constructor(private decorative=false){super('campus');}
 create(){
 const tex=this.textures.createCanvas('campus-tiles',160,32)!,ctx=tex.context;
 ['#88b878','#83b173','#e2d5b3','#e7dcbc','#628b65'].forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(i*32,0,32,32);ctx.fillStyle=i===2?'#cdbf9d':'#739f67';for(let k=0;k<6;k++)ctx.fillRect(i*32+(k*13)%30,(k*11)%30,2,2);if(i===2){ctx.fillStyle='#eee2c3';ctx.fillRect(i*32,0,32,2);ctx.fillRect(i*32,16,32,1);ctx.fillRect(i*32+16,0,1,16);}});tex.refresh();
 this.cache.tilemap.add('salaya',{format:Phaser.Tilemaps.Formats.TILED_JSON,data:tiledMap()});const map=this.make.tilemap({key:'salaya'}),tiles=map.addTilesetImage('campus','campus-tiles')!;const ground=map.createLayer('Ground',tiles)!;ground.setCollision(5);
 this.physics.world.setBounds(32,32,(COLS-2)*TILE,(ROWS-2)*TILE);
 const walls=this.physics.add.staticGroup();
 const rect=(x:number,y:number,w:number,h:number,color:number,depth=0)=>this.add.rectangle(x,y,w,h,color).setOrigin(0).setDepth(depth);
 objects.forEach(o=>{
 const depth=o.kind==='pond'?1:o.y+o.height;
 const obstacle=this.add.rectangle(o.x+o.width/2,o.y+o.height/2,o.width,o.height,0,0);this.physics.add.existing(obstacle,true);walls.add(obstacle);
 if(o.kind==='building'){
 const cafe=o.name==='cafeteria';rect(o.x+8,o.y+12,o.width,o.height,0x4f6955,1);rect(o.x,o.y,o.width,o.height,0xece6cf,depth);rect(o.x,o.y,o.width,18,0xb8b7a4,depth);rect(o.x-8,o.y-48,o.width+16,52,cafe?0x5d8284:0x536f9a,depth);rect(o.x-12,o.y-6,o.width+24,10,cafe?0x345f66:0x3d527a,depth);for(let x=o.x+16;x<o.x+o.width-16;x+=32){rect(x,o.y-42,2,32,cafe?0x769c9a:0x6b87b0,depth);}
 for(let x=o.x+24;x<o.x+o.width-20;x+=64){rect(x,o.y+40,36,48,0x658fa3,depth);rect(x+3,o.y+43,30,18,0x9bc0cd,depth);rect(x+17,o.y+40,3,48,0xfaf2d8,depth);rect(x,o.y+62,36,3,0xfaf2d8,depth);rect(x-3,o.y+88,42,5,0xb3b9ae,depth);}
 rect(o.x+o.width/2-24,o.y+o.height-62,48,62,0x3a536b,depth);rect(o.x+o.width/2-20,o.y+o.height-57,17,44,0x82a8b5,depth);rect(o.x+o.width/2+3,o.y+o.height-57,17,44,0x82a8b5,depth);rect(o.x+o.width/2-38,o.y+o.height,76,8,0xbdbba6,depth);
 this.add.text(o.x+o.width/2,o.y+16,o.label!,{fontFamily:'monospace',fontSize:cafe?'17px':'14px',color:'#344666',fontStyle:'bold'}).setOrigin(.5,0).setDepth(depth);
 if(cafe){for(let i=0;i<9;i++)rect(o.x+i*32,o.y+98,32,24,i%2?0xfff3d6:0xc67e65,depth);}
 }else if(o.kind==='tree'){
 rect(o.x+10,o.y-24,13,48,0x795f43,depth);rect(o.x+17,o.y-21,5,42,0x97764d,depth);
 this.add.ellipse(o.x+18,o.y+26,66,18,0x476f4f,.25).setDepth(o.y-2);
 [[-18,-65,64,42,0x416e52],[-26,-88,80,42,0x527e56],[-12,-110,52,36,0x65945e],[-5,-105,32,12,0x7fa76b],[-19,-76,20,13,0x6c985f]].forEach(([x,y,w,h,c])=>rect(o.x+x,o.y+y,w,h,c,depth));
 }else if(o.kind==='pond'){
 rect(o.x-8,o.y-8,o.width+16,o.height+16,0xc0c4a0,depth);rect(o.x,o.y,o.width,o.height,0x69a8b0,depth);rect(o.x+8,o.y+8,o.width-16,8,0x8dc7c4,depth);for(let i=0;i<12;i++){const shimmer=rect(o.x+16+(i*53)%220,o.y+24+(i*29)%110,20,2,0xa3d0c5,depth);this.tweens.add({targets:shimmer,alpha:.25,duration:1300+i*90,yoyo:true,repeat:-1});}rect(o.x+32,o.y+112,26,9,0x4c8f70,depth);rect(o.x+44,o.y+108,5,5,0xf4c3bf,depth);
 }else if(o.kind==='bench'){rect(o.x,o.y-13,o.width,12,0xa87d52,depth);rect(o.x,o.y+2,o.width,10,0xc59c67,depth);rect(o.x+6,o.y+12,5,12,0x58615b,depth);rect(o.x+53,o.y+12,5,12,0x58615b,depth);
 }else{rect(o.x+13,o.y-12,6,36,0x8d7453,depth);rect(o.x-26,o.y-44,84,36,0xefe7c9,depth);this.add.text(o.x+16,o.y-32,'GARDEN ←',{fontFamily:'monospace',fontSize:'12px',color:'#496354'}).setOrigin(.5).setDepth(depth);}
 });
 // Campus entrance, flowers, lamps, and gathering-area furnishings.
 for(const x of [690,874]){rect(x,1010,22,90,0xe3dfc6,1100);rect(x-4,1008,30,10,0x788e84,1100);}rect(690,997,206,24,0x4d6879,1100);this.add.text(793,1009,'M A H I D O L',{fontFamily:'monospace',fontSize:'17px',color:'#fff6dd'}).setOrigin(.5).setDepth(1101);
 for(let i=0;i<75;i++){const x=70+(i*137)%1380,y=70+(i*71)%950;if((x>660&&x<890)||(y>390&&y<520)||(y>680&&y<810)||objects.some(o=>x>o.x-30&&x<o.x+o.width+30&&y>o.y-110&&y<o.y+o.height+20))continue;rect(x,y,2,7,0x547b4d,1);rect(x-2,y-2,6,4,i%3===0?0xf3c3b0:0xecd888,1);}
 for(const [x,y] of [[650,530],[930,530],[650,900],[930,900]]){rect(x,y-40,4,45,0x586c65,y);rect(x-5,y-50,14,13,0xffe6aa,y);rect(x-6,y-53,16,4,0x586c65,y);}
 const dot=this.textures.createCanvas('player-collider',18,12)!;dot.refresh();
 const state=useStore.getState();this.body=this.physics.add.image(state.position.x,state.position.y,'player-collider').setOrigin(.5,1).setVisible(false);this.body.setSize(18,12).setCollideWorldBounds(true);this.physics.add.collider(this.body,walls);this.physics.add.collider(this.body,ground);
 this.player=new LayeredCharacter(this,this.body.x,this.body.y,state.character);this.player.container.setDepth(this.body.y);
 const ploy=new LayeredCharacter(this,824,560,{...defaultCharacter,hair:3,hairColor:1,outfit:0});this.npcs.push(ploy);
 this.add.text(824,482,'PLOY',{fontFamily:'monospace',fontSize:'12px',color:'#344354',backgroundColor:'#fff8e7',padding:{x:7,y:4}}).setOrigin(.5).setDepth(560);
 this.marker=this.add.text(824,455,'!',{fontFamily:'monospace',fontSize:'24px',color:'#f5b942',stroke:'#634f35',strokeThickness:3}).setOrigin(.5).setDepth(561);this.tweens.add({targets:this.marker,y:448,duration:750,yoyo:true,repeat:-1});
 this.npcs.push(new LayeredCharacter(this,1030,760,{...defaultCharacter,faculty:'music',hair:2,hairColor:3,outfit:2}));this.npcs.push(new LayeredCharacter(this,1150,770,{...defaultCharacter,faculty:'ict',hair:1,outfit:1}));
 this.parcel=this.add.container(478,560);this.parcel.add([this.add.rectangle(0,0,22,18,0xeac17f),this.add.rectangle(0,0,4,18,0xfdf2c6),this.add.text(0,-30,'✦',{fontSize:'22px',color:'#fff3ad'}).setOrigin(.5)]).setDepth(561);
 this.prompt=this.add.text(0,0,'',{fontFamily:'monospace',fontSize:'14px',color:'#fff8e7',backgroundColor:'#243a51',padding:{x:10,y:7}}).setOrigin(.5).setDepth(9999);
 this.cameras.main.setBounds(0,0,COLS*TILE,ROWS*TILE);this.cameras.main.startFollow(this.body,true,.12,.12);this.cameras.main.setZoom(1.1);
 if(this.decorative){this.body.setPosition(784,660);this.cameras.main.stopFollow();this.cameras.main.centerOn(770,500);this.cameras.main.setZoom(.92);this.player.container.setVisible(false);this.prompt.setVisible(false);}
 else{this.keys=this.input.keyboard!.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SHIFT,E,ESC') as Record<string,Phaser.Input.Keyboard.Key>;this.input.keyboard!.addCapture([32,37,38,39,40]);}
 }
 update(time:number){
 const state=useStore.getState();this.npcs.forEach(n=>{n.container.setDepth(n.container.y);n.update(time);});this.parcel.setVisible(state.quest==='accepted');this.marker.setVisible(state.quest==='new'||state.quest==='collected');
 if(this.decorative)return;
 if(Phaser.Input.Keyboard.JustDown(this.keys.ESC)){if(state.dialogue)state.set({dialogue:null});else state.set({paused:!state.paused});}
 let vx=0,vy=0;
 if(!state.paused&&!state.dialogue){vx=Number(this.keys.D.isDown||this.keys.RIGHT.isDown)-Number(this.keys.A.isDown||this.keys.LEFT.isDown);vy=Number(this.keys.S.isDown||this.keys.DOWN.isDown)-Number(this.keys.W.isDown||this.keys.UP.isDown);}
 const speed=this.keys.SHIFT.isDown?235:145;this.body.setVelocity(vx,vy);(this.body.body as Phaser.Physics.Arcade.Body).velocity.normalize().scale(speed);
 if(vx||vy)this.player.direction=vx<0?1:vx>0?2:vy<0?3:0;this.player.motion=vx||vy?(this.keys.SHIFT.isDown?'run':'walk'):'idle';this.player.container.setPosition(Math.round(this.body.x),Math.round(this.body.y)).setDepth(this.body.y);this.player.update(time);
 const distance=(x:number,y:number)=>Phaser.Math.Distance.Between(this.body.x,this.body.y,x,y);
 const nearby=distance(824,560)<80?'Talk to Ploy':state.quest==='accepted'&&distance(478,560)<75?'Collect quest item':distance(1030,760)<65?'Talk to Niran':distance(1150,770)<65?'Talk to Beam':'';
 if(state.nearby!==nearby)state.set({nearby});this.prompt.setText(`[E] ${nearby}`).setPosition(this.body.x,this.body.y-75).setVisible(!!nearby&&!state.dialogue&&!state.paused);
 if(time-this.lastPosition>200){state.set({position:{x:this.body.x,y:this.body.y}});this.lastPosition=time;}
 if(Phaser.Input.Keyboard.JustDown(this.keys.E)&&!state.paused){if(state.dialogue){state.set({dialogue:null});return;}if(nearby){sound();if(nearby==='Talk to Ploy'){const identity=identities[state.character.faculty];const text=state.quest==='new'?`ยินดีต้อนรับ ${state.character.nickname}! Welcome to Salaya. Ready for your first ${identity.className} adventure? ${identity.task} Follow the garden sign to the left. Your quest is now in your journal.`:state.quest==='accepted'?`${identity.task} The garden is west of this plaza, just beside the pond.`:state.quest==='collected'?'You found it! Thank you for helping our little campus. Quest complete: +100 coins and Level 2! Feel free to explore and meet the other students.':'You’re settling in already! Enjoy the garden, meet your classmates, and make yourself at home.';state.questEvent('talk');state.set({dialogue:{name:'Ploy · Student mentor',text}});}else if(nearby==='Collect quest item'){state.questEvent('collect');state.set({dialogue:{name:'Quest item collected',text:'Everything is here! Bring your discovery back to Ploy at the central plaza.'}});}else state.set({dialogue:{name:nearby==='Talk to Niran'?'Niran · Music student':'Beam · ICT student',text:nearby==='Talk to Niran'?'The garden is my favorite place to practice. A new semester feels like the first note of a song. What will yours sound like?':'Welcome! The Learning Commons is north of the plaza. This is our little gathering spot after class. See you around!'}});}}
 if(time-this.lastSave>15000&&!state.paused){state.save();this.lastSave=time;}
 }
}
