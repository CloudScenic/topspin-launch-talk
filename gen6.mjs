// TopSpin launch talk: whole page from one data list. Edit TOPICS, then: node gen6.mjs (writes index.html)
// Number tokens in a fact: {key:type:default:small:big}  type m=money i=count p=percent t=time(minutes) d=date
import fs from 'fs';
const TOPICS=[
 {sec:'01',id:'flyer',t:'Flyer',ic:'file-image',art:'flyer',rows:[
  ['flyer','badge-check','Design','8.5 x 11, ready to print'],
  ['fl-qty','copy','How many','{fl_qty:i::50:250} printed'],
  ['fl-where','map-pin','Where they go','Counter, window, college'],
  ['fl-es','languages','Spanish','Version on file']]},
 {sec:'01',id:'door',t:'Window cling',ic:'app-window',art:'door',rows:[
  ['door','badge-check','Design','Static cling, no glue'],
  ['dc-size','ruler','Size','{dc_w:i:12:1:4} x {dc_h:i:12:1:4} inches'],
  ['dc-where','app-window','Which window','Inside or outside the glass'],
  ['dc-qty','copy','How many','{dc_qty:i:2}']]},
 {sec:'01',id:'stickers',t:'Stickers',ic:'qr-code',art:'stickers',rows:[
  ['stickers','badge-check','Design','3 x 4 waterproof vinyl'],
  ['st-count','hash','How many','{st_count:i:112} machines, skip 959 and 960'],
  ['st-cost','tag','Print cost','About {st_cost:m:1.50} each'],
  ['st-who','user-check','Who puts them up','Staff, then we scan each one']]},
 {sec:'01',id:'offer',t:'The offer',ic:'gift',offer:true,rows:[
  ['offer','badge-check','The offer','Points that bring them back'],
  ['of-join','user-plus','Join','{of_join:i:250:50:250} points'],
  ['of-double','zap','Double points','{of_x:i:2}x every Tue and Wed'],
  ['of-reward','gift','Reward','{of_reward:i:2000:100:500} points = a wash on us'],
  ['of-student','graduation-cap','College deal','{of_student:i::50:250} bonus points']]},
 {sec:'02',id:'prices',t:'Prices',ic:'tag',photo:'wash',rows:[
  ['wf-drop','shirt','Drop-off','{wf_drop:m:1.75} a pound, {wf_drop_min:i:10} lb min'],
  ['wf-pick','package','Pickup','{wf_pick:m:1.99} a pound, {wf_pick_min:m:30:1:5} min'],
  ['wf-trip','truck','Trip, both ways','{trip1:m:4.99} · {trip2:m:8.99} · {trip3:m:12.99}'],
  ['wf-zones','map','Zones','Up to {z1:i:3} · {z2:i:6} · {z3:i:10} miles'],
  ['wf-plans','calendar-check','Monthly plans','{pl1:i:20:5:10} lb {pp1:m:39:1:5} · {pl2:i:40:5:10} lb {pp2:m:72:1:5} · {pl3:i:80:5:10} lb {pp3:m:129:1:5} · {pl4:i:120:5:10} lb {pp4:m:179:1:5}'],
  ['wf-over','circle-plus','Over the plan','{wf_over:m:2.19} a pound']]},
 {sec:'02',id:'before',t:'Before it opens',ic:'clipboard-list',photo:'fold',rows:[
  ['wf-scale','scale','Scale','Certified for trade, Ventura County'],
  ['wf-lbs','gauge','Pounds a day','Staff can fold {lbs_day:i::10:50} lb a day'],
  ['wf-drive','car','Driver','Your driver or a delivery service'],
  ['wf-lost','shield-alert','Lost or damaged','Up to {lost_x:i:10}x the pound price, cap {lost_cap:m:100:5:25}'],
  ['wf-unpaid','credit-card','Unpaid orders','Hold the bags, or card on file'],
  ['wf-pl','receipt','Bills and P&L','To lock the prices']]},
 {sec:'03',id:'fascard',t:'Call FasCard',ic:'phone-call',photo:'dryers',rows:[
  ['f-logins','key-round','More logins','Up to {logins:i:10}, one per phone start'],
  ['f-own','user-check','Your login','Move machine starts to your account'],
  ['f-access','chart-line','Sales and prices','Open access on your login'],
  ['f-dryers','trash-2','Old dryers','Remove 959 and 960']]},
 {sec:'03',id:'day',t:'Launch day',ic:'flag',photo:'signs',rows:[
  ['d-print','printer','Print','About {print_days:i:7} days'],
  ['d-stick','qr-code','Stickers up','We scan every one'],
  ['d-staff','users','Staff','{staff_min:i:15:5:15} minutes on how customers join'],
  ['d-college','graduation-cap','College visit','When: {college_date:d:}']]},
 {sec:'03',id:'confirm',t:'Confirm',ic:'badge-check',photo:'floor',rows:[
  ['c-hours','clock','Hours','{open_t:t:330:15:60} to {close_t:t:1440:15:60}, last wash {last_t:t:1350:15:60}'],
  ['c-phone','phone','Phone','(805) 366-0302'],
  ['c-mach','circle-dollar-sign','Machine prices','Washers from {w_from:m:3} · dryers {dry:m:0.25} per {dry_min:i:9} min']]},
 {sec:'04',id:'launch',t:'Launch',ic:'rocket',photo:'app',rows:[
  ['l-date','calendar-days','Launch date','{launch_date:d:}'],
  ['l-day1','smartphone','Day one','Join, earn points, start machines'],
  ['l-plus','crown','TopSpin+','On at launch, or later'],
  ['l-cash','wallet','Laundry Cash','{lc_load:m:20:5:10} gets {lc_bonus:m:2:0.5:1} bonus, up to {lc_cap:p:20:1:5}%']]},
 {sec:'04',id:'paper',t:'Paperwork',ic:'signature',photo:'counter',rows:[
  ['p-agree','pen-line','Agreement','Sign the service agreement'],
  ['p-pay','banknote','Pay Cloud Scenic','Setup {setup:m::100:1000} · Monthly {monthly:m::50:250}'],
  ['p-legal','file-text','Legal pages','Your lawyer: Terms, Privacy, Texts, Refunds']]}
];
const SECS={'01':'Approve','02':'Wash and fold · Dec or Jan','03':'Before launch','04':'Launch and paperwork'};
const STEP={m:[.25,1],i:[1,10],p:[1,5],t:[15,60],d:[0,0]};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const names=[...new Set(TOPICS.flatMap(x=>[x.ic,...x.rows.map(r=>r[1])]).concat(['x','chevron-left','chevron-right','maximize-2']))];
const sym={};
for(const n of names){const r=await fetch('https://unpkg.com/lucide-static@latest/icons/'+n+'.svg');if(!r.ok)throw new Error('icon '+n+' '+r.status);
 const s=await r.text();sym[n]=s.slice(s.indexOf('>',s.indexOf('<svg'))+1,s.lastIndexOf('</svg>')).replace(/<!--[\s\S]*?-->/g,'').trim()}
const sprite='<svg width="0" height="0" style="position:absolute" aria-hidden="true">'+names.map(n=>'<symbol id="i-'+n+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+sym[n]+'</symbol>').join('')+'</svg>';
const I=n=>'<svg aria-hidden="true"><use href="#i-'+n+'"/></svg>';

const keys=new Set();
const fact=f=>esc(f).replace(/\{([a-z0-9_]+):([mipdt]):([^:}]*)(?::([^:}]*))?(?::([^:}]*))?\}/g,(_,k,ty,df,s,b)=>{
 if(keys.has(k))throw new Error('dup key '+k);keys.add(k);
 return '<button type="button" class="num" data-k="'+k+'" data-ty="'+ty+'" data-df="'+df+'" data-s="'+(s||STEP[ty][0])+'" data-b="'+(b||STEP[ty][1])+'"></button>'});
const ids=new Set();
const rowH=(r,j)=>{if(ids.has(r[0]))throw new Error('dup id '+r[0]);ids.add(r[0]);
 return '<div class="r" data-id="'+r[0]+'" data-t="'+esc(r[2])+'" style="animation-delay:'+(j*.06+.12).toFixed(2)+'s"><i class="ic">'+I(r[1])+'</i><div class="rl"><b>'+esc(r[2])+'</b><span>'+fact(r[3])+'</span></div><div class="rc"><button type="button" data-v="yes">Yes</button><button type="button" data-v="no">No</button><button type="button" class="nb" aria-label="Note for '+esc(r[2])+'">Note</button></div><textarea class="rn" rows="2" placeholder="Note"></textarea></div>'};
const N=TOPICS.length;
const offerBig='<div class="bigs"><div><b data-live="of_join">250</b><span>to join</span></div><div><b data-live="of_x" data-suf="x">2x</b><span>Tue + Wed</span></div><div><b data-live="of_reward">2,000</b><span>= a wash</span></div></div>';
const left=x=>x.photo?'<div class="fart photo"><img src="img/t/'+x.photo+'.jpg" alt="">':x.art?'<div class="fart art"><button type="button" class="zoom" data-zoom="'+x.art+'" aria-label="Open '+esc(x.t)+' full size"><img src="img/'+x.art+'.jpg" alt="'+esc(x.t)+'"><span class="zi">'+I('maximize-2')+'</span></button>':'<div class="fart offer">'+offerBig;
const panel=(x,i)=>'<div class="panel" data-p="'+i+'">'+left(x)+'<div class="fh"><span class="tic">'+I(x.ic)+'</span><h2>'+esc(x.t)+'<span class="dot">.</span></h2><p class="fp"></p></div></div><div class="fbody"><div class="rows2">'+x.rows.map(rowH).join('')+'</div><div class="fbar"><button type="button" class="fn" data-go="'+((i-1+N)%N)+'">'+I('chevron-left')+'<span>'+esc(TOPICS[(i-1+N)%N].t)+'</span></button><div class="fdots">'+TOPICS.map((y,k)=>'<button type="button" data-go="'+k+'" class="'+(k===i?'on':'')+'" aria-label="'+esc(y.t)+'"></button>').join('')+'</div><button type="button" class="fn" data-go="'+((i+1)%N)+'"><span>'+esc(TOPICS[(i+1)%N].t)+'</span>'+I('chevron-right')+'</button></div></div></div>';
const ring=n=>'<span class="ring"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19"/><circle class="rf" cx="22" cy="22" r="19"/></svg><b>0/'+n+'</b></span>';
const chips=x=>'<span class="chips">'+x.rows.map(r=>'<span data-c="'+r[0]+'">'+I(r[1])+'</span>').join('')+'</span>';
const card=(x,i)=>'<button type="button" class="card" data-t="'+i+'" style="animation-delay:'+(i*.06).toFixed(2)+'s"><span class="thumb">'+(x.art?'<img src="img/'+x.art+'-s.jpg" alt="">':offerBig)+'</span>'+ring(x.rows.length)+'<span class="cb"><span class="name">'+esc(x.t)+'</span>'+chips(x)+'</span></button>';
const tile=(x,i)=>'<button type="button" class="tile" data-t="'+i+'" style="animation-delay:'+(i*.05).toFixed(2)+'s"><img class="bg" src="img/t/'+x.photo+'.jpg" alt=""><span class="tic">'+I(x.ic)+'</span>'+ring(x.rows.length)+'<span class="tb"><span class="tt">'+esc(x.t)+'</span>'+chips(x)+'</span></button>';
const section=k=>{const list=TOPICS.map((x,i)=>[x,i]).filter(([x])=>x.sec===k);
 return '<section><p class="sk"><span>'+k+'</span>'+esc(SECS[k])+'</p><div class="'+(k==='01'?'row':'tiles n'+list.length)+'">'+list.map(([x,i])=>k==='01'?card(x,i):tile(x,i)).join('')+'</div></section>'};

const css=fs.readFileSync('gen6.css','utf8');
const js=fs.readFileSync('gen6.js','utf8');
const html=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex">
<title>TopSpin Launch Talk</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap">
<style>
${css}
</style>
</head>
<body>
${sprite}
<div class="wrap">
<header>
<div><img class="logo" src="img/logo-white.svg" alt="TopSpin"><h1>Launch talk<span class="dot">.</span></h1></div>
<div class="meta"><span class="pill">Joe · Nov 12</span><span class="pill"><b id="done">0</b> / <b id="total">0</b> decided</span><button class="copy" id="copy" type="button">Copy notes</button></div>
</header>
${['01','02','03','04'].map(section).join('\n')}
</div>
<div class="fx" id="fx" hidden role="dialog" aria-modal="true" aria-label="Topic"><button class="x" id="fxx" type="button" aria-label="Close">${I('x')}</button>
${TOPICS.map(panel).join('\n')}
</div>
<div class="pop" id="pop" hidden><button type="button" class="pb" data-d="-b"></button><button type="button" class="pb" data-d="-s"></button><input id="popi" autocomplete="off" spellcheck="false"><button type="button" class="pb" data-d="+s"></button><button type="button" class="pb" data-d="+b"></button><button type="button" class="pb clr" data-d="clr">Clear</button></div>
<div class="lb" id="lb" hidden><button class="x" type="button" aria-label="Close">${I('x')}</button><img id="lbi" alt=""></div>
<script>
var TOPICS=${JSON.stringify(TOPICS.map(x=>({t:x.t})))};
${js}
</script>
</body>
</html>
`;
fs.writeFileSync('index.html',html);
console.log('ok topics',N,'rows',ids.size,'numbers',keys.size,'bytes',html.length);
