import {useStore} from './store';
let ctx:AudioContext|undefined, timer:ReturnType<typeof setInterval>|undefined, step=0;
function tone(freq:number,volume:number,duration:number){if(!ctx||volume===0)return;const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(0,ctx.currentTime);gain.gain.linearRampToValueAtTime(volume*.12,ctx.currentTime+.03);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+duration);}
export function unlockAudio(){ctx??=new AudioContext();void ctx.resume();if(!timer)timer=setInterval(()=>{if(document.hidden)return;const notes=[261.63,329.63,392,523.25,440,392,329.63,293.66];tone(notes[step++%notes.length],useStore.getState().music,1.2);},650);}
export function sound(){unlockAudio();tone(659.25,useStore.getState().sound,.2);}
