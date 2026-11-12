var KEY='topspin-talk-v3',st={};
try{st=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}}
function o(id){return st[id]=st[id]||{}}
st._n=st._n||{};
var $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var fx=document.getElementById('fx'),panels=$$('.panel'),openers=$$('[data-t]').filter(function(e){return e.classList.contains('card')||e.classList.contains('tile')}),ti=-1,spi=0,fxLast=null;
/* numbers */
function nval(k,el){return Object.prototype.hasOwnProperty.call(st._n,k)?st._n[k]:el.dataset.df}
function money(v){v=+v;return '$'+(v%1===0&&v>=10?v.toLocaleString('en-US'):v.toFixed(2))}
function hm(v){v=((+v%1440)+1440)%1440;var h=Math.floor(v/60),m=v%60,ap=h<12?'AM':'PM',h12=h%12||12;return h12+':'+(m<10?'0':'')+m+' '+ap}
function fmt(ty,v){if(v===''||v==null)return '___';
 if(ty==='m')return money(v);if(ty==='t')return hm(v);
 if(ty==='d'){var d=new Date(v+'T12:00:00');return isNaN(d)?v:d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}
 return (+v).toLocaleString('en-US')}
function parse(ty,s){s=String(s).trim();if(s==='')return '';
 if(ty==='d')return s;
 if(ty==='t'){var m=s.toLowerCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(a|p)?/);if(!m)return null;var h=+m[1],mi=+(m[2]||0);if(m[3]==='p'&&h<12)h+=12;if(m[3]==='a'&&h===12)h=0;return h*60+mi}
 var n=parseFloat(s.replace(/[$,%x¢\s]/g,''));if(isNaN(n))return null;if(/¢/.test(s))n=n/100;
 return ty==='m'?Math.round(n*100)/100:Math.round(n)}
function setN(k,v){st._n[k]=v;save();$$('.num[data-k="'+k+'"]').forEach(function(el){paintNum(el);el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump')});paintLive()}
function paintNum(el){var v=nval(el.dataset.k,el);el.textContent=fmt(el.dataset.ty,v);el.classList.toggle('blank',v===''||v==null)}
function paintLive(){$$('[data-live]').forEach(function(el){var k=el.dataset.live,src=document.querySelector('.num[data-k="'+k+'"]');if(!src)return;var v=nval(k,src);el.textContent=v===''?'___':(el.dataset.fmt==='m'?money(v):(+v).toLocaleString('en-US')+(el.dataset.suf||''))})}
function lab(ty,x){x=+x;if(ty==='m')return x<1?Math.round(x*100)+'¢':'$'+(x>=1000?(x/1000)+'k':x);if(ty==='t')return x>=60?(x/60)+' hr':x+' min';if(ty==='p')return x+'%';return String(x)}
var pop=document.getElementById('pop'),popi=document.getElementById('popi'),pel=null;
function openPop(el,focus){var rr=el.closest('.r');if(rr&&ti>=0){var ix=rowsOf(panels[ti]).indexOf(rr);if(ix!==spi||!rr.classList.contains('sp'))spot(ix)}pel=el;$$('.num.act').forEach(function(e){e.classList.remove('act')});el.classList.add('act');var ty=el.dataset.ty;
 pop.classList.toggle('date',ty==='d');popi.type=ty==='d'?'date':'text';
 $$('.pb',pop).forEach(function(b){var d=b.dataset.d;if(d==='clr')return;b.textContent=(d[0]==='-'?'−':'+')+lab(ty,d[1]==='s'?el.dataset.s:el.dataset.b)});
 var v=nval(el.dataset.k,el);popi.value=ty==='d'?(v||''):(v===''?'':fmt(ty,v));
 pop.hidden=false;var r=el.getBoundingClientRect(),w=pop.offsetWidth,h=pop.offsetHeight,x=Math.min(Math.max(12,r.left+r.width/2-w/2),innerWidth-w-12),y=r.bottom+10;if(y+h>innerHeight-12)y=r.top-h-10;
 pop.style.left=x+'px';pop.style.top=y+'px';if(focus){popi.focus();popi.select&&popi.select()}}
function closePop(){if(!pop.hidden){pop.hidden=true;if(pel){pel.classList.remove('act');pel=null}}}
function stepPop(dir,big){if(!pel)return;var ty=pel.dataset.ty;if(ty==='d')return;var v=nval(pel.dataset.k,pel),base=v===''?0:+v,st_=+(big?pel.dataset.b:pel.dataset.s),n=base+dir*st_;
 n=ty==='m'?Math.round(n*100)/100:n;if(ty!=='t'&&n<0)n=0;setN(pel.dataset.k,n);popi.value=fmt(ty,n)}
$$('.pb',pop).forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();var d=b.dataset.d;
 if(d==='clr'){setN(pel.dataset.k,'');popi.value='';return}stepPop(d[0]==='-'?-1:1,d[1]==='b')})});
function applyInput(){if(!pel)return;var v=parse(pel.dataset.ty,popi.value);if(v===null){popi.classList.add('bad');return}setN(pel.dataset.k,v)}
popi.addEventListener('keydown',function(e){e.stopPropagation();if(e.key==='Enter'){applyInput();closePop()}else if(e.key==='Escape')closePop();else if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();stepPop(e.key==='ArrowUp'?1:-1,e.shiftKey)}});
popi.addEventListener('change',function(){if(pel&&pel.dataset.ty==='d')applyInput()});
popi.addEventListener('blur',function(){if(pel&&pel.dataset.ty!=='d'&&popi.value!==fmt(pel.dataset.ty,nval(pel.dataset.k,pel)))applyInput()});
pop.addEventListener('click',function(e){e.stopPropagation()});
document.addEventListener('click',function(e){if(!pop.hidden&&!e.target.closest('.num'))closePop()});
$$('.num').forEach(function(el){paintNum(el);
 el.addEventListener('click',function(e){e.stopPropagation();if(pel===el&&!pop.hidden&&el.dataset.ty!=='d'){return}openPop(el,el.dataset.ty==='d')});
 el.addEventListener('dblclick',function(e){e.stopPropagation();openPop(el,true)})});
paintLive();
/* decisions */
function rowsOf(p){return $$('.r',p)}
function decided(p){return rowsOf(p).filter(function(r){return o(r.dataset.id).v}).length}
function paint(){var all=$$('.r'),d=0;
 all.forEach(function(r){var s=o(r.dataset.id);if(s.v)d++;r.classList.toggle('yes',s.v==='yes');r.classList.toggle('no',s.v==='no');
  $$('[data-v]',r).forEach(function(b){b.classList.toggle('on',b.dataset.v===s.v);b.setAttribute('aria-pressed',b.dataset.v===s.v)});
  r.querySelector('.nb').classList.toggle('has',!!s.n);$$('[data-c="'+r.dataset.id+'"]').forEach(function(c){c.className=s.v||''})});
 document.getElementById('done').textContent=d;document.getElementById('total').textContent=all.length;
 openers.forEach(function(t){var p=panels[+t.dataset.t],n=rowsOf(p).length,k=decided(p);t.querySelector('.ring b').textContent=k+'/'+n;t.querySelector('.rf').style.strokeDashoffset=119.4*(1-k/n)});
 panels.forEach(function(p,i){p.querySelector('.fp').textContent=(i+1)+' / '+panels.length+'  ·  '+decided(p)+' of '+rowsOf(p).length+' decided'});
 $$('.fdots button').forEach(function(b){var p=panels[+b.dataset.go];b.classList.toggle('done',decided(p)===rowsOf(p).length)})}
$$('.r').forEach(function(r){var s=o(r.dataset.id),t=r.querySelector('.rn');t.value=s.n||'';if(s.n)r.classList.add('open');
 $$('[data-v]',r).forEach(function(b){b.addEventListener('click',function(){s.v=s.v===b.dataset.v?'':b.dataset.v;save();paint()})});
 r.querySelector('.nb').addEventListener('click',function(){r.classList.add('open');t.focus()});
 t.addEventListener('input',function(){s.n=t.value;save();paint()});
 t.addEventListener('blur',function(){if(!t.value)r.classList.remove('open')})});
/* focus view */
function spot(i){var rs=rowsOf(panels[ti]);spi=Math.max(0,Math.min(rs.length-1,i));rs.forEach(function(r,j){r.classList.toggle('sp',j===spi)});panels[ti].classList.add('spot');rs[spi].scrollIntoView({block:'nearest',behavior:'smooth'})}
function openT(i){closePop();if(ti<0)fxLast=document.activeElement;ti=(i+panels.length)%panels.length;panels.forEach(function(p){p.classList.remove('on','spot')});
 var p=panels[ti];void p.offsetWidth;p.classList.add('on');fx.hidden=false;document.body.style.overflow='hidden';spot(0);paint();document.getElementById('fxx').focus({preventScroll:true})}
function closeT(){closePop();fx.hidden=true;document.body.style.overflow='';ti=-1;paint();if(fxLast)fxLast.focus()}
openers.forEach(function(t){t.addEventListener('click',function(){openT(+t.dataset.t)})});
panels.forEach(function(p){rowsOf(p).forEach(function(r,j){r.addEventListener('click',function(e){if(e.target.closest('textarea,.rc'))return;spot(j)});
 $$('.rc button,textarea',r).forEach(function(el){el.addEventListener('focus',function(){spot(j)})})})});
$$('[data-go]').forEach(function(b){b.addEventListener('click',function(){openT(+b.dataset.go)})});
document.getElementById('fxx').addEventListener('click',closeT);
var lb=document.getElementById('lb'),lbi=document.getElementById('lbi');
$$('[data-zoom]').forEach(function(b){b.addEventListener('click',function(){lbi.src='img/'+b.dataset.zoom+'.jpg';lbi.alt=b.getAttribute('aria-label');lb.hidden=false})});
lb.addEventListener('click',function(){lb.hidden=true});
document.addEventListener('keydown',function(e){
 if(!lb.hidden){if(e.key==='Escape')lb.hidden=true;return}
 if(!pop.hidden&&e.key==='Escape'){closePop();return}
 if(fx.hidden)return;if(e.key==='Escape'){closeT();return}if(e.target.tagName==='TEXTAREA'||e.target.tagName==='INPUT')return;
 if(e.key==='ArrowRight'){e.preventDefault();openT(ti+1)}if(e.key==='ArrowLeft'){e.preventDefault();openT(ti-1)}
 if(e.key==='ArrowDown'){e.preventDefault();closePop();spot(spi+1)}if(e.key==='ArrowUp'){e.preventDefault();closePop();spot(spi-1)}});
/* copy notes */
document.getElementById('copy').addEventListener('click',function(){var b=this,txt='TopSpin launch talk with Joe, Nov 12\n'+panels.map(function(p,i){
 return '\n'+TOPICS[i].t.toUpperCase()+'\n'+rowsOf(p).map(function(r){var s=o(r.dataset.id);return '- '+r.dataset.t+': '+r.querySelector('.rl span').textContent.replace(/\s+/g,' ').trim()+'  ['+(s.v?s.v.toUpperCase():'open')+']'+(s.n?'\n    '+s.n.replace(/\n/g,'\n    '):'')}).join('\n')}).join('\n');
 function ok(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy notes'},1600)}
 function fb(){var t=document.createElement('textarea');t.value=txt;document.body.appendChild(t);t.select();try{document.execCommand('copy');ok()}catch(e){}t.remove()}
 if(navigator.clipboard)navigator.clipboard.writeText(txt).then(ok,fb);else fb()});
paint();
