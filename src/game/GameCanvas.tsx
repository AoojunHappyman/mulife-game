import {useEffect,useRef} from 'react';
import Phaser from 'phaser';
import {CampusScene} from './CampusScene';
import {LayeredCharacter,type Direction,type Motion} from './sprites';
import type {Character} from '../data';
export function GameCanvas({decorative=false}:{decorative?:boolean}){const ref=useRef<HTMLDivElement>(null);useEffect(()=>{const game=new Phaser.Game({type:Phaser.AUTO,parent:ref.current!,width:960,height:540,pixelArt:true,roundPixels:true,backgroundColor:'#88b878',physics:{default:'arcade',arcade:{debug:false}},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:new CampusScene(decorative),audio:{noAudio:true}});return()=>game.destroy(true);},[decorative]);return <div ref={ref} className="game-canvas" aria-label={decorative?'Animated pixel-art Salaya campus':'Playable Salaya campus. Move with WASD or arrows, interact with E.'}/>;}
export function CharacterPreview({character,direction,motion,zoom}:{character:Character;direction:Direction;motion:Motion;zoom:number}){
 const ref=useRef<HTMLDivElement>(null),actor=useRef<LayeredCharacter|null>(null),latest=useRef({character,direction,motion,zoom});latest.current={character,direction,motion,zoom};
 useEffect(()=>{class Preview extends Phaser.Scene {create(){actor.current=new LayeredCharacter(this,160,217,latest.current.character,latest.current.zoom);}update(time:number){if(actor.current){actor.current.direction=latest.current.direction;actor.current.motion=latest.current.motion;actor.current.container.setScale(latest.current.zoom);actor.current.update(time);}}}const game=new Phaser.Game({type:Phaser.AUTO,parent:ref.current!,width:320,height:270,transparent:true,pixelArt:true,roundPixels:true,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:Preview,audio:{noAudio:true}});return()=>{actor.current=null;game.destroy(true);};},[]);
 useEffect(()=>{actor.current?.setAppearance(character);},[character]);
 return <div ref={ref} className="character-canvas" aria-label="Live animated character preview"/>;
}
