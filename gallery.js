'use strict';
const viewer = document.getElementById('viewer');
const viewerPhoto = document.getElementById('viewer-photo');
let selected = 0;
let opener;
function showPhoto(index) {
 selected = (index + PHOTOS.length) % PHOTOS.length;
 const photo = PHOTOS[selected];
 viewerPhoto.src = photo.src;
 viewerPhoto.alt = photo.alt;
 document.getElementById('viewer-count').textContent = String(photo.number).padStart(2,'0') + ' / ' + PHOTOS.length;
}
document.querySelectorAll('[data-photo]').forEach(link => {
 link.addEventListener('click', event => {
  if(event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  opener = link;
  showPhoto(Number(link.dataset.photo));
  viewer.showModal();
 });
});
document.querySelector('.close').addEventListener('click',()=>viewer.close());
document.querySelector('.previous').addEventListener('click',()=>showPhoto(selected-1));
document.querySelector('.next').addEventListener('click',()=>showPhoto(selected+1));
viewer.addEventListener('close',()=>opener?.focus());
viewer.addEventListener('keydown',event=>{
 if(event.key==='ArrowLeft' || event.key==='ArrowRight'){
  event.preventDefault();
  showPhoto(selected + (event.key==='ArrowLeft' ? -1 : 1));
 }
});
if(document.modelContext?.registerTool) {
 const lifecycle = new AbortController();
 try {
  Promise.resolve(document.modelContext.registerTool({
   name:'list_photographs',title:'Browse Alaska photographs',
   description:'List the sixteen numbered photographs in the Alaska collection by GabrielQue.',
   inputSchema:{type:'object',properties:{},additionalProperties:false},
   annotations:{readOnlyHint:true,untrustedContentHint:false},
   execute(input) {
    if(!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length) throw new Error('This tool accepts no parameters.');
    return PHOTOS.map(photo=>({...photo,collection:'Alaska'}));
   }
  },{signal:lifecycle.signal})).catch(()=>{});
 } catch {}
 addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}

