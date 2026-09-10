'use strict';
// Every active photograph belongs to one column at every viewport width.
function distributeWallPhotos(photos,count){return Array.from({length:count},(_,column)=>photos.filter((photo,index)=>index%count===column));}
function shuffleWallPhotos(photos){
 for(let i=photos.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[photos[i],photos[j]]=[photos[j],photos[i]];}
 return photos;
}
const wall=document.querySelector('.photo-wall');
const originals=Array.from(wall.querySelectorAll('.wall-group:first-child .wall-shot')).sort((a,b)=>Number(a.dataset.wallIndex)-Number(b.dataset.wallIndex));
// Shuffle once per visit; resizing keeps this visit's ordering.
shuffleWallPhotos(originals);
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
// Returning through browser history can restore the page without reloading it.
window.addEventListener('pageshow',event=>{if(event.persisted){shuffleWallPhotos(originals);columnCount=0;layoutWall();updateMotion();}});
// Avoid running decorative motion while the page is in the background.
function updateMotion(){document.documentElement.classList.toggle('motion-paused',document.hidden);}
document.addEventListener('visibilitychange',updateMotion);
updateMotion();
