'use strict';
// Every active photograph belongs to one column at every viewport width.
function distributeWallPhotos(photos,count){return Array.from({length:count},(_,column)=>photos.filter((photo,index)=>index%count===column));}
const wall=document.querySelector('.photo-wall');
const originals=Array.from(wall.querySelectorAll('.wall-group:first-child .wall-shot')).sort((a,b)=>Number(a.dataset.wallIndex)-Number(b.dataset.wallIndex));
let columnCount=0,resizeFrame=0;
function layoutWall(){
 const count=window.innerWidth<=600?3:window.innerWidth<=1100?4:6;
 if(count!==columnCount){
  const fragment=document.createDocumentFragment();
  distributeWallPhotos(originals,count).forEach(photos=>{
   const column=document.createElement('div');column.className='wall-column';
   const track=document.createElement('div');track.className='wall-track';
   const group=document.createElement('div');group.className='wall-group';
   photos.forEach((source,index)=>{const shot=source.cloneNode(true);shot.querySelector('img').loading=index<5?'eager':'lazy';group.append(shot);});
   track.append(group,group.cloneNode(true));column.append(track);fragment.append(column);
  });
  wall.style.setProperty('--columns',String(count));wall.replaceChildren(fragment);columnCount=count;
 }
 wall.querySelectorAll('.wall-track').forEach((track,index)=>{
  // Size-based durations keep the wall slow even with the complete collection.
  const seconds=track.firstElementChild.offsetHeight/(24+(index%3)*2);
  track.style.setProperty('--duration',seconds+'s');track.style.setProperty('--delay','0s');
 });
}
window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(layoutWall);});
layoutWall();
// Avoid running decorative motion while the page is in the background.
function updateMotion(){document.documentElement.classList.toggle('motion-paused',document.hidden);}
document.addEventListener('visibilitychange',updateMotion);
updateMotion();
