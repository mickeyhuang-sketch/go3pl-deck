(()=>{
const world=document.querySelector('.world');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton=document.querySelector('#scene-motion-toggle');
const traffic=document.querySelector('.traffic-layer');
let motionPaused=reduced.matches;
function setMotion(paused){motionPaused=paused;world.dataset.motionPaused=String(paused);motionButton?.setAttribute('aria-pressed',String(paused));if(motionButton)motionButton.textContent=paused?'播放動態':'暫停動態';if(traffic){if(paused)traffic.pauseAnimations();else traffic.unpauseAnimations();}}
motionButton?.addEventListener('click',()=>setMotion(!motionPaused));
reduced.addEventListener('change',e=>setMotion(e.matches));
setMotion(motionPaused);
if(document.body.classList.contains('sculptural')){
 world.addEventListener('pointermove',e=>{if(motionPaused||e.pointerType==='touch')return;const r=world.getBoundingClientRect();world.style.setProperty('--scene-x',((e.clientX-r.left)/r.width-.5)*-18+'px');world.style.setProperty('--scene-y',((e.clientY-r.top)/r.height-.5)*-12+'px')});
 world.addEventListener('pointerleave',()=>{world.style.setProperty('--scene-x','0px');world.style.setProperty('--scene-y','0px')});
}
const panel=document.querySelector('.detail');
const entries={storage:{title:'倉儲與出貨',text:'從商品特性與出貨需求出發，認識不同倉儲服務的專長。'},delivery:{title:'配送與運輸',text:'看見貨物離開倉庫後的路徑，探索可以一起合作的夥伴。'},support:{title:'設備與系統',text:'認識支援現場作業的設備與系統，找到彼此銜接的可能。'},stories:{title:'合作的現場',text:'從人的經驗與日常工作，理解不同服務如何一起完成一件事。'}};
let origin;
function close(){panel.hidden=true;document.querySelectorAll('[data-spot]').forEach(b=>b.setAttribute('aria-expanded','false'));origin?.focus()}
document.querySelectorAll('[data-spot]').forEach(b=>b.addEventListener('click',()=>{origin=b;const data=entries[b.dataset.spot];document.querySelectorAll('[data-spot]').forEach(n=>n.setAttribute('aria-expanded',String(n===b)));panel.querySelector('h2').textContent=data.title;panel.querySelector('p').textContent=data.text;panel.hidden=false;panel.querySelector('.close').focus()}));
panel.querySelector('.close').addEventListener('click',close);panel.querySelector('.next').addEventListener('click',close);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)close()});

function fitTraffic(){traffic?.setAttribute('preserveAspectRatio',window.matchMedia('(max-width:650px)').matches?'xMidYMin meet':'xMidYMid slice')}fitTraffic();window.addEventListener('resize',fitTraffic);

})();
