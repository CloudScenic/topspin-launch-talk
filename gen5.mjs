// Builds the topic tiles + focus view for sections 02 and 03. Run: node gen5.mjs (edits index.html in place)
import fs from 'fs';
const T=[
 {sec:'02',id:'prices',t:'Prices',ph:'wash',ic:'tag',rows:[['wf-drop','shirt'],['wf-pick','package'],['wf-trip','truck'],['wf-plans','calendar-check'],['wf-over','circle-plus']]},
 {sec:'02',id:'before',t:'Before it opens',ph:'fold',ic:'clipboard-list',rows:[['wf-scale','scale'],['wf-lbs','gauge'],['wf-drive','car'],['wf-lost','shield-alert'],['wf-unpaid','credit-card'],['wf-pl','receipt']]},
 {sec:'03',id:'launch',t:'Launch',ph:'app',ic:'rocket',rows:[['l-date','calendar-days'],['l-day1','smartphone'],['l-plus','crown'],['l-cash','wallet']]},
 {sec:'03',id:'paper',t:'Paperwork',ph:'counter',ic:'signature',rows:[['p-agree','pen-line'],['p-pay','banknote'],['p-legal','file-text']]},
 {sec:'03',id:'fascard',t:'Call FasCard',ph:'dryers',ic:'phone-call',rows:[['f-logins','key-round'],['f-own','user-check'],['f-access','chart-line'],['f-dryers','trash-2']]},
 {sec:'03',id:'day',t:'Launch day',ph:'signs',ic:'flag',rows:[['d-print','printer'],['d-stick','qr-code'],['d-staff','users'],['d-college','graduation-cap']]},
 {sec:'03',id:'confirm',t:'Confirm',ph:'floor',ic:'badge-check',rows:[['c-hours','clock'],['c-phone','phone'],['c-mach','circle-dollar-sign']]}
];
const names=[...new Set(T.flatMap(x=>[x.ic,...x.rows.map(r=>r[1])]).concat(['x','chevron-left','chevron-right']))];
const sym={};
for(const n of names){const r=await fetch('https://unpkg.com/lucide-static@latest/icons/'+n+'.svg');if(!r.ok)throw new Error('icon '+n+' '+r.status);
 const s=await r.text();sym[n]=s.slice(s.indexOf('>',s.indexOf('<svg'))+1,s.lastIndexOf('</svg>')).replace(/<!--[\s\S]*?-->/g,'').trim()}
const sprite='<svg width="0" height="0" style="position:absolute" aria-hidden="true">'+names.map(n=>'<symbol id="i-'+n+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+sym[n]+'</symbol>').join('')+'</svg>';
const I=n=>'<svg aria-hidden="true"><use href="#i-'+n+'"/></svg>';

let s=fs.readFileSync('index.html','utf8');
if(!s.includes('<div class="cols">'))throw new Error('unexpected source');
const a=s.indexOf('<section><p class="sk"><span>02</span>'),lb=s.indexOf('<div class="lb"'),b=s.lastIndexOf('</section>',lb)+10;
const old=s.slice(a,b);
const row=id=>{const m=old.match(new RegExp('<div class="r" data-id="'+id+'"[\\s\\S]*?</textarea></div>'));if(!m)throw new Error('row '+id);return m[0]};
const tile=(x,i)=>'<button type="button" class="tile" data-t="'+i+'" style="animation-delay:'+(i*.06).toFixed(2)+'s"><img class="bg" src="img/t/'+x.ph+'.jpg" alt=""><span class="tic">'+I(x.ic)+'</span><span class="ring"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19"/><circle class="rf" cx="22" cy="22" r="19"/></svg><b>0/'+x.rows.length+'</b></span><span class="tb"><span class="tt">'+x.t+'</span><span class="chips">'+x.rows.map(r=>'<span data-c="'+r[0]+'">'+I(r[1])+'</span>').join('')+'</span></span></button>';
const sec=(k,label,cls)=>'<section><p class="sk"><span>'+k+'</span>'+label+'</p><div class="tiles '+cls+'">'+T.map((x,i)=>x.sec===k?tile(x,i):'').join('')+'</div></section>';
const tiles=sec('02','Wash and fold · Dec or Jan','two')+'\n'+sec('03','Before launch','five');
const panels=T.map((x,i)=>'<div class="panel" data-p="'+i+'" data-ph="'+x.ph+'" data-ic="'+x.ic+'" data-tt="'+x.t+'">'+x.rows.map((r,j)=>row(r[0]).replace('<div class="r" ','<div class="r" style="animation-delay:'+(j*.06+.1).toFixed(2)+'s" ').replace('<div class="rl">','<i class="ic">'+I(r[1])+'</i><div class="rl">')).join('')+'</div>').join('');
const fx='<div class="fx" id="fx" hidden role="dialog" aria-modal="true" aria-labelledby="fxt"><div class="fart"><img id="fxi" alt=""><div class="fh"><span class="tic" id="fxic"></span><h2 id="fxt"></h2><p class="fp" id="fxp"></p></div></div><div class="fbody"><button class="x" id="fxx" type="button" aria-label="Close">'+I('x')+'</button><div class="panels">'+panels+'</div><div class="fbar"><button type="button" class="fn" id="fxpv">'+I('chevron-left')+'<span></span></button><div class="fdots">'+T.map((x,i)=>'<button type="button" data-d="'+i+'" aria-label="'+x.t+'"></button>').join('')+'</div><button type="button" class="fn" id="fxnx"><span></span>'+I('chevron-right')+'</button></div></div></div>';
s=s.slice(0,a)+tiles+s.slice(b);
s=s.replace('<div class="lb" id="lb"',fx+'\n<div class="lb" id="lb"');
s=s.replace('<body>\n','<body>\n'+sprite+'\n');
const css=`
.tiles{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:16px}
.tile{grid-column:span 2;position:relative;height:clamp(210px,28vh,290px);border-radius:22px;overflow:hidden;text-align:left;border:1px solid var(--line);isolation:isolate;animation:in .7s cubic-bezier(.22,.7,.3,1) both;transition:transform .3s cubic-bezier(.22,.7,.3,1),box-shadow .3s,border-color .3s}
.tiles.two .tile{grid-column:span 3;height:clamp(230px,32vh,320px)}
.tiles.five .tile:nth-child(n+4){grid-column:span 3}
.tile:hover{transform:translateY(-5px);box-shadow:0 24px 50px rgba(0,0,0,.35);border-color:rgba(228,181,90,.6)}
.tile img.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;transition:transform 1.4s cubic-bezier(.22,.7,.3,1)}
.tile:hover img.bg{transform:scale(1.08)}
.tile:after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(8,28,56,.1) 0%,rgba(8,28,56,.3) 40%,rgba(8,28,56,.95) 100%)}
.tic{width:52px;height:52px;border-radius:16px;background:var(--gold);color:var(--navy);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(0,0,0,.25)}
.tic svg{width:26px;height:26px}
.tile .tic{position:absolute;top:18px;left:18px}
.ring{position:absolute;top:16px;right:16px;width:56px;height:56px;display:flex;align-items:center;justify-content:center;background:rgba(8,28,56,.55);backdrop-filter:blur(6px);border-radius:50%}
.ring svg{position:absolute;inset:6px;width:44px;height:44px;transform:rotate(-90deg)}
.ring circle{fill:none;stroke:rgba(255,255,255,.18);stroke-width:3}
.ring .rf{stroke:var(--gold);stroke-linecap:round;stroke-dasharray:119.4;stroke-dashoffset:119.4;transition:stroke-dashoffset .6s cubic-bezier(.22,.7,.3,1)}
.ring b{font-family:var(--mono);font-size:12px;font-weight:600}
.tb{position:absolute;left:20px;right:20px;bottom:18px;display:block}
.tt{display:block;font-size:clamp(24px,2.3vw,34px);font-weight:800;letter-spacing:-.035em;line-height:1}
.chips{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}
.chips span{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.14);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;transition:all .3s}
.chips span.yes{background:var(--gold);border-color:var(--gold);color:var(--navy)}
.chips span.no{background:var(--pale);border-color:var(--pale);color:var(--navy)}
.chips svg{width:17px;height:17px}
@media(max-width:900px){.tiles{grid-template-columns:1fr 1fr}.tile,.tiles.two .tile,.tiles.five .tile:nth-child(n+4){grid-column:span 1}}
@media(max-width:560px){.tiles{grid-template-columns:1fr}}
.fx{position:fixed;inset:0;z-index:55;background:var(--navy);display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);animation:fade .3s}
.fx[hidden]{display:none}
.fart{position:relative;overflow:hidden}
.fart img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;animation:kb 20s ease-out both}
@keyframes kb{from{transform:scale(1.14)}to{transform:scale(1)}}
.fart:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,37,69,0) 35%,rgba(11,37,69,.92) 100%),linear-gradient(90deg,rgba(11,37,69,0) 70%,var(--navy) 100%)}
.fh{position:absolute;z-index:1;left:clamp(28px,4vw,56px);right:28px;bottom:clamp(28px,6vh,64px);animation:in .7s .1s cubic-bezier(.22,.7,.3,1) both}
.fh .tic{width:72px;height:72px;border-radius:22px}.fh .tic svg{width:36px;height:36px}
.fh h2{font-size:clamp(46px,5.4vw,86px);line-height:.95;letter-spacing:-.05em;font-weight:800;margin-top:18px}
.fp{font-family:var(--mono);font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin-top:14px}
.fbody{position:relative;overflow:auto;padding:clamp(72px,9vh,96px) clamp(24px,4vw,64px) 28px;display:flex;flex-direction:column}
.panels{flex:1;display:flex;flex-direction:column;justify-content:center}
.panel{display:none}.panel.on{display:block}
.panel .r{grid-template-columns:auto minmax(0,1fr) auto;gap:8px 18px;padding:16px 18px;border:1px solid var(--line);border-radius:18px;background:rgba(18,50,90,.5);margin-bottom:12px;cursor:pointer;animation:in .55s cubic-bezier(.22,.7,.3,1) both;transition:opacity .3s,transform .3s,border-color .3s,background .3s}
.panel .r .ic{width:54px;height:54px;border-radius:16px;background:rgba(46,168,230,.16);color:var(--sky);display:flex;align-items:center;justify-content:center;transition:all .3s}
.panel .r .ic svg{width:27px;height:27px}
.panel .rl{grid-template-columns:1fr;gap:4px}
.panel .rl b{font-size:clamp(19px,1.6vw,24px);letter-spacing:-.02em}
.panel .rl span{font-size:16px}
.panel .r.yes .rl b:before,.panel .r.no .rl b:before{display:none}
.panel .r.yes .ic{background:var(--gold);color:var(--navy)}
.panel .r.no .ic{background:var(--pale);color:var(--navy)}
.panel.spot .r{opacity:.35}
.panel.spot .r.sp{opacity:1;transform:scale(1.02);border-color:rgba(228,181,90,.75);background:var(--card2);box-shadow:0 16px 36px rgba(0,0,0,.28)}
.panel .rc button{font-size:12px;padding:11px 16px}
.panel .rn{margin-top:6px}
.fx .x{position:absolute;top:20px;right:20px}.fx .x svg{width:24px;height:24px}
.fbar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:20px;padding-top:18px;border-top:1px solid var(--line)}
.fn{display:flex;align-items:center;gap:8px;font-weight:700;font-size:15px;color:var(--soft);padding:10px 14px;border-radius:999px;border:1px solid var(--line);transition:all .2s}
.fn:hover{color:var(--pale);border-color:var(--gold)}.fn svg{width:18px;height:18px}
.fdots{display:flex;gap:8px}
.fdots button{width:10px;height:10px;border-radius:5px;background:rgba(255,255,255,.22);transition:all .3s}
.fdots button.on{width:30px;background:var(--gold)}
.fdots button.done{background:var(--soft)}.fdots button.on.done{background:var(--gold)}
.tile:focus-visible,.fn:focus-visible,.fdots button:focus-visible,.panel .r:focus-visible{outline:3px solid var(--sky);outline-offset:3px}
@media(max-width:900px){.fx{grid-template-columns:1fr;grid-template-rows:34vh 1fr}.fbody{padding-top:24px}.fx .x{position:fixed}}
`;
s=s.replace('@media (prefers-reduced-motion:reduce)',css.trim()+'\n@media (prefers-reduced-motion:reduce)');
const js=`
var tiles=[].slice.call(document.querySelectorAll('.tile')),panels=[].slice.call(document.querySelectorAll('.panel')),fx=document.getElementById('fx'),fxi=document.getElementById('fxi'),dots=[].slice.call(document.querySelectorAll('.fdots button')),ti=-1,spi=0,fxLast=null;
function pRows(p){return [].slice.call(p.querySelectorAll('.r'))}
function decided(p){return pRows(p).filter(function(r){return o(r.dataset.id).v}).length}
function paintTiles(){tiles.forEach(function(t){var p=panels[+t.dataset.t],n=pRows(p).length,d=decided(p);t.querySelector('.ring b').textContent=d+'/'+n;t.querySelector('.rf').style.strokeDashoffset=119.4*(1-d/n);
 t.querySelectorAll('[data-c]').forEach(function(c){var v=o(c.dataset.c).v;c.className=v||''})});
 dots.forEach(function(b,i){var p=panels[i];b.classList.toggle('done',decided(p)===pRows(p).length);b.classList.toggle('on',i===ti)});
 if(ti>=0){var p=panels[ti];document.getElementById('fxp').textContent=(ti+1)+' / '+panels.length+'  ·  '+decided(p)+' of '+pRows(p).length+' decided'}}
function spot(i){var rs=pRows(panels[ti]);spi=Math.max(0,Math.min(rs.length-1,i));rs.forEach(function(r,j){r.classList.toggle('sp',j===spi)});panels[ti].classList.add('spot');rs[spi].scrollIntoView({block:'nearest',behavior:'smooth'})}
function openT(i){if(ti<0)fxLast=document.activeElement;ti=(i+panels.length)%panels.length;var p=panels[ti];
 panels.forEach(function(q){q.classList.remove('on','spot')});
 void p.offsetWidth;p.classList.add('on');
 var n=fxi.cloneNode();n.src='img/t/'+p.dataset.ph+'.jpg';fxi.parentNode.replaceChild(n,fxi);fxi=n;
 var fh=document.querySelector('.fh'),f2=fh.cloneNode(true);fh.parentNode.replaceChild(f2,fh);
 document.getElementById('fxic').innerHTML='<svg aria-hidden="true"><use href="#i-'+p.dataset.ic+'"/></svg>';
 document.getElementById('fxt').innerHTML=p.dataset.tt+'<span class="dot">.</span>';
 var pv=panels[(ti-1+panels.length)%panels.length].dataset.tt,nx=panels[(ti+1)%panels.length].dataset.tt;
 document.querySelector('#fxpv span').textContent=pv;document.querySelector('#fxnx span').textContent=nx;
 fx.hidden=false;document.body.style.overflow='hidden';spot(0);paintTiles();document.getElementById('fxx').focus({preventScroll:true})}
function closeT(){fx.hidden=true;document.body.style.overflow='';ti=-1;paintTiles();if(fxLast)fxLast.focus()}
tiles.forEach(function(t){t.addEventListener('click',function(){openT(+t.dataset.t)})});
panels.forEach(function(p){pRows(p).forEach(function(r,j){r.tabIndex=-1;r.addEventListener('click',function(e){if(e.target.closest('button,textarea'))return;spot(j)});
 r.querySelectorAll('button,textarea').forEach(function(el){el.addEventListener('focus',function(){spot(j)})})})});
document.getElementById('fxx').addEventListener('click',closeT);
document.getElementById('fxpv').addEventListener('click',function(){openT(ti-1)});
document.getElementById('fxnx').addEventListener('click',function(){openT(ti+1)});
dots.forEach(function(b,i){b.addEventListener('click',function(){openT(i)})});
document.addEventListener('keydown',function(e){if(fx.hidden)return;if(e.key==='Escape'){closeT();return}if(e.target.tagName==='TEXTAREA')return;
 if(e.key==='ArrowRight'){e.preventDefault();openT(ti+1)}if(e.key==='ArrowLeft'){e.preventDefault();openT(ti-1)}
 if(e.key==='ArrowDown'){e.preventDefault();spot(spi+1)}if(e.key==='ArrowUp'){e.preventDefault();spot(spi-1)}});
var _pr=paintRows;paintRows=function(){_pr();paintTiles()};paintTiles();
`;
s=s.replace('paintRows();count();\n</script>','paintRows();count();\n'+js.trim()+'\n</script>');
fs.writeFileSync('index.html',s);
const rows=(s.match(/class="r" style/g)||[]).length;
console.log('ok rows',rows,'tiles',(s.match(/class="tile"/g)||[]).length,'key',s.includes("KEY='topspin-talk-v3'"),'bytes',s.length);
