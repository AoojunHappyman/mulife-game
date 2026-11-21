import Phaser from 'phaser';
import {hairColors,skinColors,identities,type Character} from '../data';
export type Direction=0|1|2|3;
export type Motion='idle'|'walk'|'run';
export const LAYERS=['backHair','body','bottom','shoes','top','face','frontHair','accessories'] as const;
export const FRAME={width:32,height:48,perDirection:9,anchorX:.5,anchorY:1};
// Each texture contains the same 4 directions × 9 frames. Production assets can
// replace makeLayer while preserving these frame and anchor contracts.
function makeLayer(scene:Phaser.Scene,layer:typeof LAYERS[number],c:Character):string {
 const key=`layer-${layer}-${layer.includes('Hair')?[c.hair,c.hairColor]:layer==='body'?[c.skin,c.body]:layer==='face'?[c.eyes,c.skin]:[c.outfit,c.body,c.faculty]}`;
 if(scene.textures.exists(key))return key;
 const texture=scene.textures.createCanvas(key,32*9,48*4)!;
 const ctx=texture.context;
 for(let dir=0;dir<4;dir++)for(let f=0;f<9;f++){
 const ox=f*32,oy=dir*48,bob=f===0?0:(f%2===0?-1:0),stride=f===0?0:([0,-2,0,2][(f-1)%4])*(f>4?1.5:1),wide=c.body===1?1:0;
 const r=(x:number,y:number,w:number,h:number,color:string)=>{ctx.fillStyle=color;ctx.fillRect(ox+x,oy+y+bob,w,h);};
 const skin=skinColors[c.skin],hair=hairColors[c.hairColor],accent=identities[c.faculty].color,side=dir===1||dir===2;
 if(layer==='backHair'&&c.hair>=2){r(7,7,18,24,hair);if(c.hair===3)r(dir===1?23:3,12,6,20,hair);}
 if(layer==='body'){r(9,9,14,16,skin);r(7,12,18,9,skin);r(13,24,6,5,skin);r(6-wide,28,4,10,skin);r(22+wide,28,4,10,skin);}
 if(layer==='bottom'){r(10-wide,35,6+wide,8+stride,'#34465c');r(17,35,5+wide,8-stride,'#34465c');if(c.outfit===0&&c.body===1)r(8,34,16,6,'#283952');}
 if(layer==='shoes'){r(8-wide,42+stride,8,3,'#263445');r(17,42-stride,8,3,'#263445');r(8-wide,44+stride,8,1,'#fcf1db');r(17,44-stride,8,1,'#fcf1db');}
 if(layer==='top'){const top=c.outfit===0?'#fffbef':c.outfit===1?accent:'#d9966e';r(9-wide,27,14+wide*2,10,top);r(6-wide,27,4,6,top);r(22+wide,27,4,6,top);r(12,26,8,2,'#fff5df');if(c.outfit===0){r(15,28,2,8,accent);r(20,30,2,2,'#d3a34c');}else{r(10,29,2,7,'#efe9d7');r(21,29,2,7,'#efe9d7');}if(dir===3)r(12,30,8,2,'#eee6d5');}
 if(layer==='face'&&dir!==3){const eyeY=c.eyes===2?18:17;if(side){r(dir===1?8:21,eyeY,2,c.eyes===1?1:3,'#303548');}else{r(10,eyeY,2,c.eyes===1?1:3,'#303548');r(20,eyeY,2,c.eyes===1?1:3,'#303548');r(14,22,4,1,'#b87568');r(8,21,3,1,'#d99b8c');r(21,21,3,1,'#d99b8c');}}
 if(layer==='frontHair'){r(9,5,14,3,hair);r(6,8,20,6,hair);r(6,13,3,6,hair);r(23,13,3,6,hair);if(c.hair===0){r(9,13,5,3,hair);r(18,13,5,2,hair);}if(c.hair===1){r(8,12,10,5,hair);r(9,6,6,2,'#9a7252');}if(c.hair===2){r(7,12,17,3,hair);r(6,18,3,8,hair);r(23,18,3,8,hair);}if(c.hair===3){r(7,12,10,3,hair);r(23,11,3,3,accent);}if(c.hair===4){r(4,10,4,8,hair);r(24,10,4,8,hair);r(11,13,4,4,hair);r(19,13,4,3,hair);}if(dir===3)r(8,12,16,11,hair);}
 if(layer==='accessories'&&c.outfit===1&&dir!==3){r(18,31,3,3,'#f5b942');r(19,30,1,5,'#fff0b9');}
 texture.add(dir*9+f,0,ox,oy,32,48);
 }
 texture.refresh();return key;
}
export class LayeredCharacter {
 container:Phaser.GameObjects.Container;layers:Phaser.GameObjects.Image[]=[];direction:Direction=0;motion:Motion='idle';
 constructor(private scene:Phaser.Scene,x:number,y:number,c:Character,scale=1.5){this.container=scene.add.container(x,y);const shadow=scene.add.ellipse(0,-2,24,8,0x233e40,.22);this.container.add(shadow);this.container.setScale(scale);this.setAppearance(c);}
 setAppearance(c:Character){this.layers.forEach(l=>l.destroy());this.layers=LAYERS.map(layer=>{const im=this.scene.add.image(0,0,makeLayer(this.scene,layer,c),0).setOrigin(.5,1);this.container.add(im);return im;});}
 update(time:number){const frame=this.motion==='idle'?0:(this.motion==='walk'?1:5)+Math.floor(time/(this.motion==='run'?85:145))%4;this.layers.forEach(l=>{l.setFrame(this.direction*9+frame);l.setY(this.motion==='idle'&&Math.floor(time/900)%2===0?-1:0);});}
 destroy(){this.container.destroy();}
}
