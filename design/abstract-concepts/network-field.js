/* A connected 3D node landscape, projected live; no raster sheet rotation. */
(()=>{
const canvas=document.querySelector('.network-field');
if(!canvas)return;
const ctx=canvas.getContext('2d'),world=canvas.closest('.world');
let seed=7291;
const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
const points=[],edges=[],columns=29,rows=25;
for(let r=0;r<rows;r++)for(let c=0;c<columns;c++){
 points.push({x:(c-14)*145+(random()-.5)*140,z:(r-15)*135+(random()-.5)*120,phase:random()*6.28,weight:random()});
 const i=r*columns+c;
 if(c)edges.push([i-1,i]);
 if(r)edges.push([i-columns,i]);
 if(c&&r)edges.push(random()>.5?[i-columns-1,i]:[i-columns,i-1]);
}
const buttons=[...world.querySelectorAll(".spot")];
let anchors=[],width=1,height=1,time=0,last=0,visible=true,dirty=true;
function resize(){anchors=[];width=world.clientWidth;height=world.clientHeight;const ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);dirty=true;draw();}
new ResizeObserver(resize).observe(world);
new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;}).observe(world);
const glow=document.createElement('canvas');glow.width=glow.height=64;
const g=glow.getContext('2d'),gradient=g.createRadialGradient(32,32,0,32,32,32);
gradient.addColorStop(0,'rgba(221,242,255,.9)');gradient.addColorStop(.12,'rgba(186,223,247,.65)');gradient.addColorStop(.32,'rgba(96,166,211,.22)');gradient.addColorStop(1,'rgba(68,133,184,0)');g.fillStyle=gradient;g.fillRect(0,0,64,64);
function draw(){
 ctx.clearRect(0,0,width,height);
 const yaw=Math.sin(time*.09)*.16,cos=Math.cos(yaw),sin=Math.sin(yaw),pitch=.43+Math.sin(time*.07)*.025;
 const cp=Math.cos(pitch),sp=Math.sin(pitch),focal=Math.max(width*.68,height*.82);
 const projected=points.map((p,index)=>{
  const x=p.x*cos+p.z*sin,z=p.z*cos-p.x*sin;
  const y=Math.sin(p.x*.0028+time*.22)*62+Math.cos(p.z*.003+time*.17)*65+Math.sin(p.phase+time*.3)*15;
  const depth=(1320-z)*cp+(610-y)*sp,scale=focal/Math.max(depth,200);
  return{index,x:width*.53+x*scale,y:height*(width<651?.25:.33)+((610-y)*cp-(1320-z)*sp)*scale,depth,scale,weight:p.weight};
 });
 for(const [ia,ib] of edges){const a=projected[ia],b=projected[ib];if(a.depth<230||b.depth<230)continue;
  const depth=(a.depth+b.depth)*.5,alpha=Math.max(.07,Math.min(.55,650/depth*.7));
  ctx.strokeStyle=`rgba(127,180,219,${alpha})`;ctx.lineWidth=Math.min(1.65,Math.max(.65,1150/depth));
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
 }
 // Choose existing connected vertices once per layout; controls follow those vertices.
 if(!anchors.length){
  const targets=width<651?[[.20,.24],[.54,.35],[.45,.46]]:[[.27,.29],[.66,.32],[.79,.54]];
  for(const [tx,ty] of targets){
   const candidates=projected.filter(p=>p.depth>300&&p.x>32&&p.x<width-135&&p.y>145&&p.y<height*.57&&!anchors.includes(p.index));
   candidates.sort((a,b)=>Math.hypot(a.x-width*tx,a.y-height*ty)-Math.hypot(b.x-width*tx,b.y-height*ty));
   anchors.push((candidates[0]||projected[0]).index);
  }
 }
 anchors.forEach((index,i)=>{
  const p=projected[index],button=buttons[i];
  button.style.setProperty('--node-x',p.x+'px');button.style.setProperty('--node-y',p.y+'px');
  button.dataset.vertex=String(index);
 });
 projected.sort((a,b)=>b.depth-a.depth);
 for(const p of projected){if(p.depth<230||p.x<-40||p.x>width+40||p.y<-40||p.y>height+40)continue;
  const active=anchors.includes(p.index),emphasized=active&&buttons[anchors.indexOf(p.index)].matches(":hover,:focus-visible,[aria-expanded=true]");
  const radius=active?(emphasized?8:6):Math.min(5.8,Math.max(.7,p.scale*(p.weight>.83?3.1:1.4))),size=radius*(active?13:p.weight>.83?14:8);
  ctx.globalAlpha=active?.95:p.weight>.83?.8:.42;ctx.drawImage(glow,p.x-size/2,p.y-size/2,size,size);ctx.globalAlpha=1;
  ctx.fillStyle=active?'rgba(236,249,255,1)':p.weight>.83?'rgba(226,244,255,.92)':'rgba(157,202,231,.68)';ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.fill();
 }
 canvas.dataset.frame=String(Math.round(time*1000));dirty=false;
}
function frame(now){const delta=last?Math.min((now-last)/1000,.05):0;last=now;
 if(visible&&!document.hidden){if(world.dataset.motionPaused!=='true'){time+=delta;dirty=true;}if(dirty)draw();}
 requestAnimationFrame(frame);
}
buttons.forEach(b=>{for(const event of ['pointerenter','pointerleave','focus','blur','click'])b.addEventListener(event,()=>{dirty=true;draw();});});
resize();draw();requestAnimationFrame(frame);
})();
