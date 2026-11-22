(()=>{'use strict';
const $=id=>document.getElementById(id);
const show=(id,yes)=>$(id).classList.toggle('hidden',!yes);
const memKey='afterhours-session-v3';
let session=null,state=null,stream=null,toastTimer;
const params=new URLSearchParams(location.search);
const roomLink=params.get('room');
if(roomLink)$('roomCode').value=roomLink.toUpperCase();
function toast(msg){const t=$('toast');t.textContent=msg;show('toast',true);clearTimeout(toastTimer);toastTimer=setTimeout(()=>show('toast',false),3600)}
async function api(path,params={}){const rsp=await fetch('/api/'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(params)});let data;try{data=await rsp.json()}catch{throw new Error('The server could not be reached.')}if(!rsp.ok)throw new Error(data.error||'Something went wrong.');return data}
async function run(fn){try{await fn()}catch(e){toast(e.message||'Connection error')}}
function setSession(data){session={room:data.room,token:data.token};localStorage.setItem(memKey,JSON.stringify(session));connect()}
function connect(){if(stream)stream.close();if(!session)return;const q=new URLSearchParams({room:session.room,token:session.token});stream=new EventSource('/events?'+q);$('connection').innerHTML='<span class="dot"></span> CONNECTING';stream.addEventListener('state',e=>{state=JSON.parse(e.data);$('connection').innerHTML='<span class="dot"></span> LIVE';render()});stream.onerror=()=>{$('connection').innerHTML='<span class="dot" style="background:#ed9b89"></span> RECONNECTING'};}
function action(op,other={}){if(!session)return;return run(async()=>{await api(op,{...session,...other})})}
function playerHTML(p,index,active=false){const el=document.createElement('div');el.className='person'+(active?' active':'');const left=document.createElement('div');left.className='personleft';const avatar=document.createElement('span');avatar.className='avatar';avatar.textContent=index+1;const text=document.createElement('div');const name=document.createElement('div');name.className='personname';name.textContent=p.name;const stat=document.createElement('div');stat.className='status'+(p.online?'':' offline');stat.textContent=p.online?'● Online':'○ Offline';text.append(name,stat);left.append(avatar,text);const right=document.createElement('span');right.className='mini';right.textContent=active?'✦ PLAYING':index===0?'HOST':'';el.append(left,right);return el}
function drawRoster(container,activeIndex=-1){const root=$(container);root.replaceChildren();state.players.forEach((p,i)=>root.appendChild(playerHTML(p,i,i===activeIndex)))}
function render(){if(!state)return;show('welcome',false);show('room',!state.started);show('game',state.started);$('roomCodeDisplay').textContent=state.room;$('inviteLink').value=location.origin+'/?room='+encodeURIComponent(state.room);$('count').textContent=state.players.length;const activeIndex=state.started?state.currentIndex%state.players.length:-1;drawRoster('roster');drawRoster('gameRoster',activeIndex);
show('hostSettings',state.isHost);show('guestWaiting',!state.isHost);
$('start').disabled=state.players.length<2;
$('customList').replaceChildren();if(state.isHost){for(const c of state.custom){const d=document.createElement('div');d.className='customitem';const inner=document.createElement('div');const top=document.createElement('div');top.className='eyebrow';top.textContent=c.type+' · '+c.level.toUpperCase();const p=document.createElement('p');p.textContent=c.prompt;inner.append(top,p);const del=document.createElement('button');del.type='button';del.textContent='REMOVE';del.addEventListener('click',()=>action('custom-delete',{id:c.id}));d.append(inner,del);$('customList').appendChild(d)}}
if(!state.started)return;
$('gameRoom').textContent=state.room;
const complete=state.currentIndex>=state.total;
$('turnTitle').textContent=complete?'Round complete!':state.yourTurn?'Your turn, '+state.you+'!':state.turnName+"'s turn";
$('turnSubtitle').textContent=complete?'The whole deck has been played.':state.yourTurn?'You control this card. Everyone else is watching live.':state.revealed?'Card revealed to the whole party.':'Waiting for '+state.turnName+' to reveal their card…';
$('progress').textContent=complete?'FINISHED':(state.currentIndex+1)+' / '+state.total;
$('card').classList.toggle('flipped',state.revealed);
$('cardType').textContent=complete?'THE END':state.revealed?state.currentCard.type+' · '+state.currentCard.level.toUpperCase():'HIDDEN CARD';
$('cardCrest').textContent=complete?'✧':state.revealed?'♥':'✦';
$('cardText').textContent=complete?'That was a night to remember.':state.revealed?state.currentCard.prompt:'The card is face down.';
$('cardFooter').textContent=complete?'SHUFFLE FOR ANOTHER ROUND':state.revealed?'PASSING IS ALWAYS OKAY • DRINKS OPTIONAL':'ONLY THE CURRENT PLAYER CAN REVEAL';
show('reveal',!complete&&state.yourTurn&&!state.revealed);
show('next',!complete&&state.revealed&&(state.yourTurn||state.isHost));
show('skip',!complete&&(state.yourTurn||state.isHost));
show('watching',!complete&&!state.yourTurn&&!state.isHost);
show('rematch',complete&&state.isHost);
}
$('create').addEventListener('click',()=>run(async()=>{const name=$('playerName').value.trim();const res=await api('create',{name});setSession(res)}));
$('join').addEventListener('click',()=>run(async()=>{const name=$('playerName').value.trim(),room=$('roomCode').value.trim().toUpperCase();const res=await api('join',{name,room});setSession(res)}));
$('playerName').addEventListener('keydown',e=>{if(e.key==='Enter')$('create').click()});
$('roomCode').addEventListener('keydown',e=>{if(e.key==='Enter')$('join').click()});
$('copyInvite').addEventListener('click',async()=>{const value=$('inviteLink').value;try{await navigator.clipboard.writeText(value);toast('Invite link copied!')}catch{$('inviteLink').focus();$('inviteLink').select();toast('Link selected. Copy it from the field.')}});
$('start').addEventListener('click',()=>action('start',{level:$('level').value}));
$('reveal').addEventListener('click',()=>action('reveal'));
$('next').addEventListener('click',()=>action('next'));
$('skip').addEventListener('click',()=>action('next'));
$('rematch').addEventListener('click',()=>action('rematch'));
$('toggleEditor').addEventListener('click',()=>show('editor',$('editor').classList.contains('hidden')));
$('editor').addEventListener('submit',e=>{e.preventDefault();run(async()=>{await api('custom-add',{...session,type:$('type').value,level:$('customLevel').value,prompt:$('prompt').value});$('prompt').value='';toast('Custom card added to this room!')})});
try{const saved=JSON.parse(localStorage.getItem(memKey)||'null');if(saved&&saved.room&&saved.token){session=saved;connect()}}catch{};
// Separate browser profiles/device tabs can join the same room. If already in one, offer a clean switch.
if(session&&roomLink&&session.room!==roomLink.toUpperCase()){if(stream)stream.close();session=null;state=null;localStorage.removeItem(memKey);show('welcome',true);show('room',false);show('game',false)}
})();
