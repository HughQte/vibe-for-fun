'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const PORT = Number(process.env.PORT || 3000);
const rooms = new Map();
const assets = path.join(__dirname,'public');
const MAX_ROOM_AGE = 24*60*60*1000;
const TYPES = ['TRUTH','DARE','DRINK','NEVER HAVE I EVER','GROUP VOTE','HOT TAKE'];
const card = (type, level, prompt) => ({id:crypto.randomUUID(),type,level,prompt});
const baseCards = [
['TRUTH','spicy','Who in this room has the most irresistible smile?'],
['TRUTH','wild','Who here would you choose for a spontaneous midnight date?'],
['TRUTH','spicy','Have you ever had a secret crush on a friend?'],
['TRUTH','wild','What is the boldest romantic move you have ever made?'],
['TRUTH','spicy','What is a green flag that immediately attracts you?'],
['TRUTH','wild','Have you ever kissed someone and regretted it the next day?'],
['TRUTH','spicy','What is your most awkward first-date memory?'],
['TRUTH','wild','What flirtatious text did you type and then delete?'],
['TRUTH','spicy','Would you rather make the first move or be pursued?'],
['TRUTH','wild','Have you ever been attracted to two friends at the same time?'],
['TRUTH','spicy','Who here gives the best dating advice?'],
['TRUTH','wild','What is a romantic secret you have never told this group?'],
['TRUTH','spicy','What is the most memorable compliment you have received?'],
['TRUTH','wild','Have you ever gone on two dates in one day?'],
['TRUTH','spicy','Who in the room is hardest to read romantically?'],
['TRUTH','wild','What is your most impulsive dating decision?'],
['TRUTH','spicy','What is your biggest harmless dating ick?'],
['TRUTH','wild','Have you ever had a secret situationship?'],
['TRUTH','spicy','Who was your most unexpected crush?'],
['TRUTH','wild','Have you ever sent a message to the wrong romantic interest?'],
['TRUTH','spicy','What makes someone instantly charming?'],
['TRUTH','wild','What is the boldest thing you would put in a dating profile?'],
['TRUTH','spicy','What celebrity would you invite to a candlelit dinner?'],
['TRUTH','wild','Have you ever pretended not to care when you were jealous?'],
['DARE','spicy','Give another willing player your most dramatic compliment.'],
['DARE','wild','Deliver your best pickup line to a willing player.'],
['DARE','spicy','Show your signature dance move for 10 seconds.'],
['DARE','wild','Hold a 15-second eye-contact contest with a willing player.'],
['DARE','spicy','Speak in a movie-trailer voice until your next turn.'],
['DARE','wild','Act out a hilariously bad first date without saying a word.'],
['DARE','spicy','Let the group choose a new nickname for your next two turns.'],
['DARE','wild','Reenact your most dramatic breakup scene as a soap opera.'],
['DARE','spicy','Do a 10-second red-carpet walk.'],
['DARE','wild','Invent a ridiculously romantic poem about a household object.'],
['DRINK','spicy','Optional: take one sip, or share a fun fact.'],
['DRINK','wild','Optional: take up to two sips, or perform a mini dance.'],
['DRINK','spicy','Everyone wearing black may take one sip—or pass.'],
['DRINK','wild','Invite the player on your left to take one sip—or pass.'],
['DRINK','spicy','Anyone sharing a clothing color with you may take one sip—or pass.'],
['DRINK','wild','Invite the player on your right to take up to two sips—or pass.'],
['DRINK','spicy','Pick someone for a toast. Either of you may sip—or pass.'],
['DRINK','wild','Players with the same first-name initial may take one sip—or pass.'],
['DRINK','spicy','Everyone wearing glasses may take one sip—or pass.'],
['DRINK','wild','The group chooses a color. Players wearing it may sip—or pass.'],
['NEVER HAVE I EVER','spicy','Never have I ever practiced a flirty text before sending it.'],
['NEVER HAVE I EVER','wild','Never have I ever kissed someone at a party.'],
['NEVER HAVE I EVER','spicy','Never have I ever had a crush on a coworker or classmate.'],
['NEVER HAVE I EVER','wild','Never have I ever secretly dated someone.'],
['NEVER HAVE I EVER','spicy','Never have I ever used a cheesy pickup line.'],
['NEVER HAVE I EVER','wild','Never have I ever kissed two different people in one weekend.'],
['NEVER HAVE I EVER','spicy','Never have I ever checked whether someone viewed my story.'],
['NEVER HAVE I EVER','wild','Never have I ever had a crush on my friend’s crush.'],
['GROUP VOTE','spicy','Who is most likely to fall in love on vacation?'],
['GROUP VOTE','wild','Who is most likely to have a secret admirer?'],
['GROUP VOTE','spicy','Who is the best wingperson in this room?'],
['GROUP VOTE','wild','Who is most likely to send a risky late-night text?'],
['GROUP VOTE','spicy','Who could talk their way into a VIP lounge?'],
['GROUP VOTE','wild','Who is most likely to make the first move?'],
['HOT TAKE','spicy','Is kissing on the first date overrated?'],
['HOT TAKE','wild','Can exes genuinely become close friends?'],
['HOT TAKE','spicy','Is chemistry more important than compatibility?'],
['HOT TAKE','wild','Can a vacation romance become a serious relationship?'],
].map(v=>card(...v));
const shuffle = (items) => {const arr=[...items];for(let i=arr.length-1;i>0;i--){let j=crypto.randomInt(i+1);[arr[i],arr[j]]=[arr[j],arr[i]]}return arr};
const newToken = () => crypto.randomBytes(24).toString('hex');
const codeGen = () => crypto.randomBytes(4).toString('hex').slice(0,6).toUpperCase();
function makeRoom(name){let code;do{code=codeGen()}while(rooms.has(code));const token=newToken();const r={code,host:token,players:[{token,name,connected:false}],started:false,deck:[],index:0,revealed:false,level:'both',extras:[],clients:new Map(),created:Date.now()};rooms.set(code,r);return {r,token}}
function err(status,message){const e=new Error(message);e.status=status;throw e}
function requireRoom(code){const r=rooms.get(String(code||'').trim().toUpperCase());if(!r)err(404,'Room not found. Check the code.');return r}
function authenticate(body){const r=requireRoom(body.room);const p=r.players.find(x=>x.token===body.token);if(!p)err(403,'Session not recognized. Rejoin using the invite link.');return {r,p}}
function lobbyPublic(r){return {room:r.code,started:r.started,hostPresent:r.players.some(p=>p.token===r.host),players:r.players.map((p,i)=>({name:p.name,order:i+1,online:p.connected})),level:r.level,custom:r.extras.map(x=>({...x})),currentIndex:r.index,total:r.deck.length,revealed:r.revealed,turnName:r.started?r.players[r.index%r.players.length]?.name:null,currentCard:r.started&&r.index<r.deck.length?{type:r.deck[r.index].type,level:r.deck[r.index].level,...(r.revealed?{prompt:r.deck[r.index].prompt}:{})}:null};}
function send(res,data,event='state'){res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)}
function notify(r){for(const [res,token] of r.clients){try{send(res,{...lobbyPublic(r),you:r.players.find(p=>p.token===token)?.name,isHost:token===r.host,yourTurn:r.started&&r.index<r.deck.length&&r.players[r.index%r.players.length]?.token===token})}catch{r.clients.delete(res)}}}
const json = (res,status,value) => {res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value))};
function getBody(req){return new Promise((resolve,reject)=>{let s='';req.on('data',x=>{s+=x;if(s.length>25000){reject(Object.assign(new Error('Request too large'),{status:413}));req.destroy()}});req.on('end',()=>{try{resolve(JSON.parse(s||'{}'))}catch{reject(Object.assign(new Error('Invalid JSON'),{status:400}))}});req.on('error',reject)})}
function cleanName(x){const n=String(x||'').trim().replace(/\s+/g,' ');if(!n||n.length>30)err(400,'Enter a name (1–30 characters).');return n}
function hostOnly(r,p){if(p.token!==r.host)err(403,'Only the room host can do this.');}
async function api(req,res,url){const body=await getBody(req);let r,p;switch(url.pathname){
case '/api/create': {const name=cleanName(body.name);({r}=makeRoom(name));const token=r.host;return json(res,200,{room:r.code,token})}
case '/api/join': {r=requireRoom(body.room);if(r.started)err(409,'This round has started. Join the next room instead.');const name=cleanName(body.name);if(r.players.length>=20)err(409,'Room is full (20 players).');if(r.players.some(x=>x.name.toLowerCase()===name.toLowerCase()))err(409,'That name is already taken.');const token=newToken();r.players.push({token,name,connected:false});notify(r);return json(res,200,{room:r.code,token})}
case '/api/start': {({r,p}=authenticate(body));hostOnly(r,p);if(r.started)err(409,'Game already started.');if(r.players.length<2)err(409,'Invite at least one other player first.');r.level=['both','spicy','wild'].includes(body.level)?body.level:'both';r.deck=shuffle([...baseCards,...r.extras].filter(x=>r.level==='both'||r.level===x.level));r.index=0;r.revealed=false;r.started=true;notify(r);return json(res,200,{ok:true})}
case '/api/reveal': {({r,p}=authenticate(body));if(!r.started||r.index>=r.deck.length)err(409,'No current card.');if(r.players[r.index%r.players.length].token!==p.token)err(403,'Only the current player can reveal.');r.revealed=true;notify(r);return json(res,200,{ok:true})}
case '/api/next': {({r,p}=authenticate(body));if(!r.started||r.index>=r.deck.length)err(409,'Round is finished.');const active=r.players[r.index%r.players.length].token;if(p.token!==active&&p.token!==r.host)err(403,'Only the current player or host can advance.');if(!r.revealed&&p.token!==r.host)err(409,'Reveal before advancing, or ask the host to skip.');r.index+=1;r.revealed=false;notify(r);return json(res,200,{ok:true})}
case '/api/custom-add': {({r,p}=authenticate(body));hostOnly(r,p);if(r.started)err(409,'Customize between games.');if(r.extras.length>=100)err(400,'100 custom cards max.');const prompt=String(body.prompt||'').trim();if(prompt.length<3||prompt.length>350)err(400,'Card text must be 3–350 characters.');const type=String(body.type||'').toUpperCase(),level=String(body.level||'');if(!TYPES.includes(type)||!['spicy','wild'].includes(level))err(400,'Invalid card category or intensity.');r.extras.push(card(type,level,prompt));notify(r);return json(res,200,{ok:true})}
case '/api/custom-delete': {({r,p}=authenticate(body));hostOnly(r,p);if(r.started)err(409,'Customize between games.');r.extras=r.extras.filter(x=>x.id!==body.id);notify(r);return json(res,200,{ok:true})}
case '/api/rematch': {({r,p}=authenticate(body));hostOnly(r,p);if(!r.started)err(409,'Game has not started.');r.started=false;r.deck=[];r.index=0;r.revealed=false;notify(r);return json(res,200,{ok:true})}
default:err(404,'Endpoint not found.');
}}
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{let url;try{url=new URL(req.url,'http://localhost');if(req.method==='GET'&&url.pathname==='/events'){const r=requireRoom(url.searchParams.get('room'));const token=url.searchParams.get('token');if(!r.players.some(p=>p.token===token))err(403,'Bad player session.');res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-store, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no'});r.clients.set(res,token);const p=r.players.find(x=>x.token===token);p.connected=true;notify(r);const heartbeat=setInterval(()=>{try{res.write(': ping\n\n')}catch{}},20000);req.on('close',()=>{clearInterval(heartbeat);r.clients.delete(res);p.connected=[...r.clients.values()].includes(token);notify(r)});return}
if(req.method==='POST'&&url.pathname.startsWith('/api/'))return await api(req,res,url);
if(req.method!=='GET')err(405,'Method not allowed.');let filename=url.pathname==='/'?'index.html':url.pathname.replace(/^\//,'');if(!['index.html','style.css','app.js'].includes(filename))err(404,'Not found.');const data=fs.readFileSync(path.join(assets,filename));res.writeHead(200,{'Content-Type':MIME[path.extname(filename)],'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(data);
}catch(e){if(!res.headersSent)json(res,e.status||500,{error:e.status?e.message:'Unexpected server error'});else res.end()}});
setInterval(()=>{for(const [code,r] of rooms)if(Date.now()-r.created>MAX_ROOM_AGE){for(const [res] of r.clients)res.end();rooms.delete(code)}},60*60*1000).unref();
server.listen(PORT,'0.0.0.0',()=>console.log(`After Hours running at http://localhost:${PORT}`));
