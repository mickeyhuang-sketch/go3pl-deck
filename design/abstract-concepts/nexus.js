const world=document.querySelector('.nexus-world');
const svg=document.querySelector('.stage svg');
const motion=document.querySelector('#motion-toggle');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduced.matches;
function setPaused(value){paused=value;world.dataset.paused=String(paused);motion.textContent=paused?'播放動態':'暫停動態';motion.setAttribute('aria-pressed',String(paused));document.querySelector('.motion-status').textContent=paused?'場景已暫停':'能力正在匯流';if(paused)svg.pauseAnimations();else svg.unpauseAnimations()}
motion.addEventListener('click',()=>setPaused(!paused));reduced.addEventListener('change',e=>{if(e.matches)setPaused(true)});setPaused(paused);
const modes={all:['每一種專長，都有交會的可能。','探索全部'],shipping:['倉儲與配送，形成一段合作。','電商出貨'],operations:['設備與系統，支援現場作業。','倉內作業']};
document.querySelectorAll('[data-mode-button]').forEach(button=>button.addEventListener('click',()=>{const mode=button.dataset.modeButton;world.dataset.mode=mode;document.querySelectorAll('[data-mode-button]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelector('.nexus-copy .sub').textContent=modes[mode][0];document.querySelector('.nexus-copy .context').textContent=modes[mode][1]}));
const panel=document.querySelector('.detail');let origin;
const entries={storage:['倉儲能力','找到合適的儲存與出貨方式，讓需求與專長在這裡交會。'],transport:['運輸能力','探索能與倉儲銜接的運輸服務，一起完成交付。'],system:['系統與設備','認識支援現場作業的工具，探索適合的合作組合。'],boxes:['商品與需求','從商品特性與工作方式出發，找到可以一起合作的專長。'],pallet:['作業支援','從儲存、搬運到出貨，認識服務之間可以交會的地方。']};
function show(el){origin=el;const [title,text]=entries[el.dataset.module];panel.querySelector('h2').textContent=title;panel.querySelector('p').textContent=text;panel.hidden=false;panel.querySelector('button').focus()}
document.querySelectorAll('[data-module]').forEach(el=>{el.addEventListener('click',()=>show(el));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show(el)}})});
function close(){panel.hidden=true;origin?.focus()}panel.querySelector('button').addEventListener('click',close);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)close()});
