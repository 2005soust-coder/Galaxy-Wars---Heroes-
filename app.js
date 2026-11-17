const TOTAL=15, A='assets/';
let players=2, chosen=new Set(Array.from({length:TOTAL},(_,i)=>i+1)), deck=[], picks=[[],[],[],[],[]], turn=0;
const $=id=>document.getElementById(id);
function show(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));$(id).classList.add('active')}
function cardPath(n){return A+`hero_${String(n).padStart(2,'0')}.png`}
function renderPicker(){
 $('heroPicker').innerHTML='';
 for(let n=1;n<=TOTAL;n++){
  const b=document.createElement('button');b.className='pick'+(chosen.has(n)?' selected':'');b.type='button';
  b.innerHTML=`<img src="${cardPath(n)}" alt="Hrdina ${n}"><span class="tick">✓</span>`;
  b.onclick=()=>{chosen.has(n)?chosen.delete(n):chosen.add(n);renderPicker()};$('heroPicker').appendChild(b);
 }
 $('selectedCount').textContent=`${chosen.size} / ${TOTAL} hrdinů vybráno`;
}
function choosePlayers(n){players=n;document.querySelectorAll('[data-n]').forEach(b=>{b.classList.toggle('active-choice',Number(b.dataset.n)===n);b.setAttribute('aria-pressed',String(Number(b.dataset.n)===n))})}
document.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>choosePlayers(Number(b.dataset.n)));
choosePlayers(2);renderPicker();
$('startBtn').onclick=()=>show('settings');$('backSplash').onclick=()=>show('splash');
$('selectAll').onclick=()=>{chosen=new Set(Array.from({length:TOTAL},(_,i)=>i+1));renderPicker()};
$('clearAll').onclick=()=>{chosen.clear();renderPicker()};
$('beginBtn').onclick=()=>{
 if(chosen.size<players*2){alert(`Pro ${players} hráčů musíš vybrat alespoň ${players*2} hrdinů.`);return}
 deck=Array.from(chosen);for(let i=deck.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]]}
 picks=[[],[],[],[],[]];turn=0;renderGame();show('game');
};
function renderGame(){
 for(let p=0;p<5;p++){
  const z=$('zone'+p);z.style.display=p<players?'flex':'none';z.querySelector('h3').textContent=`HRÁČ ${p+1}`;
  const slots=z.querySelectorAll('.slot');slots.forEach((s,i)=>{s.innerHTML=picks[p][i]?`<img src="${cardPath(picks[p][i])}" alt="Hrdina">`:`<span>${i+1}</span>`});
 }
 $('progress').textContent=`${turn} / ${players*2}`;
 $('turnInfo').textContent=turn<players*2?`HRÁČ ${(turn%players)+1} – VYBER KARTU`:'HOTOVO';
 $('deck').innerHTML='';
 deck.forEach((n,idx)=>{const b=document.createElement('button');b.className='deck-card';b.type='button';b.innerHTML=`<img src="${A}card-back.png" alt="Rub karty"><span class="hint">VYBRAT</span>`;b.onclick=()=>selectCard(idx,n);$('deck').appendChild(b)});
 $('remaining').textContent=`Zbývá ${deck.length} karet`;
}
function selectCard(idx,n){
 if(turn>=players*2)return;const p=turn%players;const b=$('deck').children[idx];if(!b)return;
 b.disabled=true;b.classList.add('flipping');
 setTimeout(()=>{b.innerHTML=`<img src="${cardPath(n)}" alt="Odhalený hrdina">`;},260);
 setTimeout(()=>{picks[p].push(n);deck.splice(idx,1);turn++;if(turn>=players*2){renderGame();finish()}else renderGame()},620);
}
function finish(){
 $('results').innerHTML='';
 for(let p=0;p<players;p++){
  const d=document.createElement('div');d.className='result-player';
  d.innerHTML=`<h3>HRÁČ ${p+1}</h3><div class="result-cards">${picks[p].map(n=>`<img src="${cardPath(n)}" alt="Hrdina ${n}">`).join('')}</div>`;
  $('results').appendChild(d);
 }
 show('done');
}
$('quitGame').onclick=()=>{if(confirm('Opravdu chceš zrušit probíhající hru?'))show('settings')};
$('newGame').onclick=()=>show('settings');$('homeBtn').onclick=()=>show('splash');
if('serviceWorker' in navigator && location.protocol!=='file:'){navigator.serviceWorker.register('./sw.js').catch(()=>{});}
