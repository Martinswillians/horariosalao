import {initializeApp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,sendEmailVerification,signOut} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {getFirestore,doc,getDoc,setDoc,collection,getDocs,query,where,writeBatch,onSnapshot} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const cfg={
  apiKey:"AIzaSyCiuo1YI9kfo7gm3ilovXDlN0gYQxq8Hns",
  authDomain:"horariosalao-ce269.firebaseapp.com",
  projectId:"horariosalao-ce269",
  storageBucket:"horariosalao-ce269.firebasestorage.app",
  messagingSenderId:"882513001742",
  appId:"1:882513001742:web:4e3ec0bd438ef929186b5f"
};
const app=initializeApp(cfg),auth=getAuth(app),db=getFirestore(app);
const A=document.getElementById('app'),$=s=>document.querySelector(s),v=id=>$('#'+id).value.trim();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const brl=n=>Number(n).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const rid=()=>Math.random().toString(36).slice(2,9);
const slugify=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const DIAS=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const tm=h=>{const [a,b]=h.split(':');return a*60+ +b},hm=m=>String(m/60|0).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
const iso=d=>new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
const wa=(t,msg='')=>{const n=t.replace(/\D/g,'');return 'https://api.whatsapp.com/send?phone='+(n.length<=11?'55':'')+n+(msg?'&text='+encodeURIComponent(msg):'')};
const price=(s,P)=>{const pct=(P||[]).filter(p=>p.ativo!==false&&(!p.servId||p.servId===s.id)).reduce((m,p)=>Math.max(m,+p.pct),0);return{pct,final:s.preco*(1-pct/100)}};
const theme=c=>document.documentElement.style.setProperty('--c',c||'#1f2a37');
const acts={};
const DEF='https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80';
const CAPAS={
 b1:{g:'b',n:'Barber clássico',css:'repeating-linear-gradient(115deg,#7f1d1d 0 22px,#f1f5f9 22px 44px,#1e3a8a 44px 66px,#f1f5f9 66px 88px)'},
 b2:{g:'b',n:'Couro e madeira',css:'linear-gradient(135deg,#3b2417,#7c4a2d 50%,#2a170e)'},
 b3:{g:'b',n:'Preto e dourado',css:'radial-gradient(circle at 80% 20%,rgba(184,134,11,.55),transparent 45%),linear-gradient(135deg,#0b0b0b,#2a2a2a)'},
 b4:{g:'b',n:'Azul-marinho',css:'repeating-linear-gradient(45deg,#0f2742 0 14px,#12304f 14px 28px)'},
 s1:{g:'s',n:'Rosé',css:'linear-gradient(135deg,#f4c7d0,#d98ca0 55%,#a85a74)'},
 s2:{g:'s',n:'Lavanda',css:'linear-gradient(135deg,#c9b8f0,#8e7cc3 55%,#5b4b8a)'},
 s3:{g:'s',n:'Champagne',css:'radial-gradient(circle at 20% 30%,#fff3d6,transparent 50%),linear-gradient(135deg,#d9b77e,#a8864f)'},
 s4:{g:'s',n:'Verde sálvia',css:'linear-gradient(135deg,#bcd3c0,#7da287 55%,#4b6e58)'}};
const cover=(u,k)=>`linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.45)),${u?`url('${u}') center/cover`:CAPAS[k]?CAPAS[k].css:`url('${DEF}') center/cover`}`;
const avc=(foto,nome,sz)=>foto?`<img class=av src="${foto}" alt="" style="width:${sz}px;height:${sz}px;margin:0;flex-shrink:0">`:`<div class=av style="width:${sz}px;height:${sz}px;line-height:${sz}px;font-size:${Math.round(sz/2.2)}px;margin:0;flex-shrink:0">${esc((nome||'?')[0])}</div>`;
const av=p=>p.foto?`<img class=av src="${p.foto}" alt="">`:`<div class=av>${esc((p.nome||'?')[0])}</div>`;
const img=(f,max,q,type='image/jpeg')=>new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{const k=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);c.getContext('2d').drawImage(i,0,0,c.width,c.height);ok(c.toDataURL(type,q))};i.onerror=no;i.src=r.result};r.onerror=no;r.readAsDataURL(f)});
const PAL=['#1f2a37','#0f3d3e','#7c2d12','#1e3a8a','#3f3f46','#6b21a8','#9d174d','#b45309'];
document.addEventListener('change',async e=>{const t=e.target,u=t.dataset.up;
  if(t.id=='cm'||t.id=='cy'){let y=+$('#cy').value,m=+$('#cm').value;const n=new Date();if(y==n.getFullYear()&&m<n.getMonth())m=n.getMonth();CALC={y,m};drawStep2();return}
  if(t.id=='lpf'){LPF=t.value;draw();return}
  if(t.classList.contains('pcustom')){$('#pf'+t.dataset.i).style.display=t.checked?'block':'none';return}
  if(t.id=='pm2'){PM=t.value||PM;draw();return}
  if(t.id=='mn'){const c=clientes().find(x=>x.nome==t.value);if(c)$('#mt').value=c.tel}
  if(t.id=='mp'){nvServ();nvSlots()}
  if(t.id=='ms'){const sv=S.servicos.find(x=>x.id==t.value);$('#mv').value=sv?fmtM(price(sv,S.promocoes).final):'';nvSlots()}
  if(t.id=='md'){NV.pre='';nvSlots()}
  if(!u||!t.files[0])return;
  try{
    if(u=='cfoto'||u=='mefoto'){const d=await img(t.files[0],160,.8);TMP[u]=d;const w=$(u=='cfoto'?'#cfpw':'#mfpw');if(w)w.innerHTML=avc(d,'?',64);return}
    if(u=='comp'){let d=await img(t.files[0],1000,.65);if(d.length>380000)d=await img(t.files[0],800,.5);if(d.length>380000)throw 0;
      await setDoc(doc(db,'saloes',ouid,'agendamentos',t.dataset.id),{comp:d,pstatus:'aguardando'},{merge:true});
      const up=t.closest('.up');if(up)up.innerHTML='✅ Comprovante enviado! O salão vai conferir o pagamento.<br><img src="'+d+'" style="max-width:180px;margin-top:8px;border-radius:8px;border:1px solid #ddd">';toast('Comprovante enviado ✔');if(step=='M')loadMeus();return}
    if(u=='foto'){TMP.foto=await img(t.files[0],160,.8);const f=$('#fp');f.src=TMP.foto;f.style.display='block'}
    else{
      if($('#p1')){S.nome=v('p1');S.whats=v('p2');S.end=v('p3');S.titulo=v('p5');S.sub=v('p6')}
      if(u=='logo')S.logo=await img(t.files[0],240,0,'image/png');
      if(u=='capa'){let d=await img(t.files[0],1400,.72);if(d.length>650000)d=await img(t.files[0],1000,.55);S.capa=d}
      await save();toast('Imagem salva ✔');draw();
    }
  }catch(x){alert('Não foi possível usar essa imagem.')}
});
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b&&acts[b.dataset.a])acts[b.dataset.a](b)});
let STANDALONE=false,ENTERING=false,MYPCT=0,ROLE='owner',ME='',OID='',ACC=[],BUSY=new Set(),BUSYKEY='',LS=null,CALC={y:new Date().getFullYear(),m:new Date().getMonth()},CU=null,CP=null,CM='login',MY=[],U=null,S=null,TAB='dash',AG=[],busy=false,EDIT=null,TMP={};
const E=l=>EDIT&&EDIT.l==l?S[l][EDIT.i]:null;
const toast=m=>{const d=document.createElement('div');d.textContent=m;d.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#111;color:#fff;padding:12px 20px;border-radius:24px;z-index:9;font-size:.95rem';document.body.append(d);setTimeout(()=>d.remove(),2200)};

/* ============ ROTEAMENTO ============ */
const MODO=document.documentElement.dataset.modo||'cliente',params=new URLSearchParams(location.search),slug=(params.get('s')||'').trim().toLowerCase(),BASE=location.origin+location.pathname.replace(/[^/]*$/,'');
STANDALONE=MODO=='profissional';
function semSlug(){
  theme();document.title=(MODO=='profissional'?'Painel do profissional':'Agendamento online')+' | Horário Salão';
  A.innerHTML=`<div class="top hero" style="background:${cover()}"><h1>${MODO=='profissional'?'Painel do profissional':'Agende seu horário'}</h1><p>Informe o endereço do salão para continuar.</p></div><div class=wrap><div class=card><label>Endereço do salão</label><input id=sgx placeholder="ex.: barbearia-martins" autocapitalize=off autocomplete=off><p class=mu style="margin-top:4px">É a parte final do link que o salão enviou, depois de <b>?s=</b>.</p><button class=btn data-a=sgo>Continuar</button><a class="btn o" style="display:block;text-align:center;text-decoration:none" href="index.html">Voltar</a></div></div>`}
acts.sgo=()=>{const x=(($('#sgx')||{}).value||'').trim().toLowerCase().replace(/[^a-z0-9-]/g,'');if(!x)return alert('Informe o endereço do salão.');location.href=location.pathname+'?s='+encodeURIComponent(x)};
if(MODO=='empresa')onAuthStateChanged(auth,u=>{U=u;if(busy)return;u?panel():landing()});
else if(!slug)semSlug();
else{
  if(STANDALONE)profPage(slug);else booking(slug);
  onAuthStateChanged(auth,async u=>{if(busy)return;CU=u;CP=null;if(u){try{CP=(await getDoc(doc(db,'clientes',u.uid))).data()||null}catch(e){}}
    if(ROLE=='prof')return;
    if(STANDALONE){if(S&&u&&u.emailVerified&&!ENTERING&&!busy)profEnter();return}
    wlListen();if(S&&$('#wiz')){hdr();if(step!='L'&&step!='M'&&step!='PL')bk()}});
}
const hdr=()=>{const h=$('#hu');if(h)h.innerHTML='<a href="#!" class=install-link data-short=1 data-a=install>App</a>'+(CU?`<a href="#agendamento" data-a=cbell>🔔${cbn()}</a><a href="#agendamento" data-a=meperfil>${CP&&CP.foto?`<img src="${CP.foto}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;vertical-align:middle;margin-right:4px">`:''}Meu perfil</a><a href="#agendamento" data-a=meus>Meus agendamentos</a><a href="#agendamento" data-a=csair>Sair</a>`:'<a href="#agendamento" data-a=clogin>Entrar</a>')};
acts.meperfil=()=>{TMP.mefoto=undefined;openM(`<h2>Meu perfil</h2><div style="text-align:center;margin:10px 0" id=mfpw>${avc(CP&&CP.foto,(CP&&CP.nome)||CU.email,84)}</div><label>Foto</label><input type=file accept="image/*" data-up=mefoto><label>Nome</label><input id=pn value="${esc(CP&&CP.nome)}"><label>WhatsApp</label><input id=pt type=tel value="${esc(CP&&CP.tel)}"><button class=btn data-a=mesave>Salvar</button><button class="btn o" data-a=closem>Fechar</button>`)};
acts.mesave=async()=>{const o={nome:v('pn'),tel:v('pt'),email:CU.email,foto:TMP.mefoto!==undefined?TMP.mefoto:(CP&&CP.foto)||''};try{await setDoc(doc(db,'clientes',CU.uid),o,{merge:true});CP={...CP,...o};closeM();hdr();toast('Perfil salvo ✔');bk()}catch(e){alert('Erro: '+(e.code||e.message))}};

/* ====== INSTALAR COMO APP (PWA) — mesma lógica da webpage da Poliana ====== */
const ICON96='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAANYElEQVR4nO2deZRU1Z3HP/ctXVXdXV290nQDYtO0IEFRYFCJDOJBIhMchbiMgEYgCokSJSHRZBxwJEYNcYvDBKOMGphRRye2ChGjkYAbhLAoyKrIqkCzKL1UV9V7984fr6poFHupqvZVju97zjv0Oa/vfbfu597f/b3f79eF6NnvHIUn16S5PYCvuzwALssD4LI8AC7LA+CyPAAuywPgsjwALssD4LI8AC7LA+CyPAAuywPgsjwALssD4LI8AC7L6KyORTt/7/PZoPa2S1WpPq+zslYZBSAATQOpQMr2DVqIEyfB7uT8nNbiYQpnrO2RrjltpQKVwTFmDIAmwJJwrFGRY0C+XyBE2+vLslVyEoQAv9G5eyBmq+QE6gKMdjxPAY3NkkgMcn0C03AWWCaUEQC6Bo0RRTCgMfbcAEP75lBeqKOJL98FSkGeX3BfbT3LNkQwNajpZvKLiQXE7MybIgWYOty+6Bjb98WISRhxho8fXxaksVnR2lpRwKFjNqu3xVi8OsyhY5L8gMDOAIS0Aega1IcV/XuazLoqSHWFScxSWHbr7aSEYJ4gkCNQKj5BBlQU6Z0KwDScn5WCQI6gskSnvlGhteGO9CjVOec0H2PP83PXs/Ws3BKlIDd9CGkB0AQ0RRR9uxvcPyVEMKBxpF6iaW1PoJQQjYEtnX4S9jUSh9cZAKRyrsTzbAnRmCJqtQ1AWdAQVpQEdeZeF+JHCz5jzYdR8vwiLXOUlhsqFRi6YOZlQUK5Gg1hhaE7H060cSGc3WMagqaooimq0IWzSqHt9h29wOlbFySfZxoCXXPG0lZ7TYChQziqMHTBT8cFCQY07DQXS8o7QNOcFTG8v48zTjWpj09+u9sLaI4qxg8PsPOgRUNYcf2ofJyP01mukOD6Ufl82lhPfkAwfniA5qg6wTNqS7oGjc2KXl11Rpzh4/l3woTyUjdFKQMQOFt4YLXprKKOthcQteCUUoP/uKEQW4HfFB2ekPYqAfysXiYLfljkeEC6IBJr/QD+sr6kgkHVJrUrw2ktl5RNkMJZDWUFOlKltg2FgEhMJduHox2fjI4+LxxVCOLnTQqT73TknGElBZpzqKdBwPVQRMsJ6IyV/3m1fEZnwm6vXAfwdZcHwGV5AFyWB8BleQBclgfAZXkAXJYHwGV5AFyWB8BleQBclgfAZaUejhYattVIxaBb6XbBECxLoqUSl/47lJROUuZAl62o+T8B00eqOYz0csJKYuaVY+Z3R+frt51y8utJN3mUdlJeyRgohbJt0DuQEvs7lpQSTdNQdjTtvjJQlnKS5GsnSil1/Do+AhACTbSvFiltZfDzdlppYqZl2zZCCDRNa3WSpZQopdr8vWxR1gNIbHc9bt4+O1bPBzt2smfvxxw9+ikKRWGogO6VFfSurqK4qDDZ1rYlepY7BlkNwJYSPV6ws/TVv/DcC0tY9+5GDtYdItwcwbZtQKHrOn6fj9KSYs7sfzpjLxnNmNEjMQ0DKSXiqzJNKSgrAah4llvXNF5f/hZzH5rP2vUbiMViSKUQQuDLySE34EcIQTQapakpzM7Gvezes4+XX11G/359mXHj9fzzP12U7DMbIWQdgMRESSmZ/cv7eGTBIhQKKSUlJcUMGXQWQ88ZRJ/TqikrKUEIweEjR9n2wQ5Wrl7LytVrqTt0mE2btzH5Bz9iwpXjuPfOn+H3+5FSoX0Vmf8OKKsAJFZ+c3OE7900kyVL/0xubi6maTDhqnFMmnglvXudetK2I/5xKFMnT2TP3o9Z+PT/8fiiZ2hsDLPw6ef48KNdLHz0IYoKQ1m3E7LmhFJKIeN16tNuuY0lr7xOIBCg5yndeG7hI9w166f07nUqUqq47T9Rtm0jpaRH90p+PnM6Lz7zBP379SHHzOGdv67huqkziESiSRc2W5Q1AKRU6LrGr38zn9rFrxDw+zh7wDdY/OyTDB44AMuy4oCcQ3fN+g1cPflGrp58I2vWb0h6SUopLMvi9D69qX16ARcO/yamYbDi7VX82y/momlaEnQ2KCsA2NJxF9dv2MQD8x4jLy+XyoquPPnIgxQXFWJZNoZhoGkiuXr3HzhI7UtLqX1pKfsPHASOnx+GYWDbNrmBAI/Nm0u/vjUEAn4eX/gMy1a8ja5rJ91FbigrACQs8q8f+i2xaAwU/GbunZSWFGPZNsZJqn5N06SwMERhYQjTNL9wX9f1JIR599+FLycHIQRzH/ottm2jtVWP/hXJ9VEkXrTe3biZ5W+uRCnFpWNGMfScwc7kf0l8SSnnLLBt+0ttuq7rWJbN6X1quObq72BLyZr1G1j+1iqEEFmxC9wHEJ+82pdepqGxCb/fz5Rrr3bMSQb6T5itSROvoihUQDQa4w8v/jF+131vyHUAuqajlGLV6nVIKenXt4azzujn3MtAdDVhaqp69mDQ2WcipWTd+o00RyLxMIW7B7KrAJxDE+oOHWbX3n0opTh7QH90XUe28Xc/Ak7w5xNu6Mlkx/96YvDAAQgBnxw4yK7dewFc94hcBwCOR9PQ0Iiu6/Surorfa72tLSXNzZFk5FPXdUzTREr5hXMhwammugrDMGhqCvPxJwfa9ZzOlssAnH/rGxqJxSw0TVBcGALaDrXn5eVSU11FYSjEv999P/c//Dt2fLQ7CSMRzmiposIQhu64qPUNDYlRZPhTdUxZEYpo6RLabZgex72UDDtvCPf9chbfvvxaDh85yqYt25n/X4sYOmQQl48dw0UjhuHz5Zywwlv27bmhHF/lRYUhfL4cbFuy/0Ad0LppcAJqgr6nVXPvnT9n8MAz8ft81NUd4oUlr3D9TTMZNmosz9UuAVTyDDhwsI6YFcM0zRZ5A3c9IZcBOB++omsXigpDSCnZsm27c6+VqKUT34fyLmXceMN1LP3DIp56fB7Xjr+C7t0qsW2bte9uTJqiRPJy89btWJZNMD+PHt0qAFyPjrpqgoQQSKUIFRTQu9ep7Ni5m7XrNtDUFCY3N9Bm5NIJ4El0XWf4+ecy/Pxz2X+gjtrFS1mzfgOXjB4JQI5pYtuSlX9dixCCnqd0p1tlBShcj4y6bghl3DxcMOw8NE1jx67dLHvjHedeW66oEMl3BVtKbFvStbyMaVOu4dGHfxWPCTl9/G3de7y/eSuaEHzz3MFomoYlvTfhZM720jEXU1ZajFKK+Qt+3/F+NA1d15IhioR/r3B20X8++gTRaIxgMJ8rxl4CgJYFeQHXASRiMt0qyrn8sm8jbcmq1etY8Pun0HWdWMzqcH+6rqNpgphlYeg6Lyx5haWvLUcpxbdGXkC/vjXJGJTbcn8EOGWOSilu/v4UKirKMXNM7rj7AVauXotpGh2GABCLWZiGwZZtHzDzX+dgmgbBYD63zviBl5D5vDTNOYy7lJUyd87tRCIRBHDdtBmseHsVpmmgFK1GPuF4hFQphWkarH/vfcZPvonm5iiNjY3Muf0nVFf1jOeGs+KjZwcAcGy4bduMHjWC2bfN4LNj9TQ1hZkwZToPP/I4lm21eMN1JtqKX4k4UML8CCF48n+e5TsTb6Du0GGO1ddz8/enMPFfxmHbdlbVCmXFm3BCiSTK9GmTQQjm3PMgpmkw554HefGPf2LShCsZOWIYXcpKgS9GSo8c/ZS/vPEOT/z3/zrmyzBpbm7mxz+cyqxbb8G2s8Put1RWAYDjoYbpUydRU13Fz2bfza49+1j/3vvc/N5sKruW843T+1DTu4ryslKEENQdOsL2Dz9i05Zt7Nn3MUoqpJKUFhfzwD2zuXLcJclDNwscnxOUdQCAZM724pEX8A8DBzDvd0/y7POL+WT/AXbt2cdHu/Y44ej4ak5UOmhxV7RLaQmXjrmY6VMn0a2ya1aXKGagPL1zPApd17GlpKS4iFm33cK0Kdfw8quvs+LNVWzd/iFHjn5KuLkZAJ8vh6LCEDXVVQwbOoTRoy6ke6UTaujMyW9ZoZ2q0vjCJoFlWezcvSe+AtMcyUmka1oy3NClrITvjr+C746/gkg0yuHDRzhW74SU8/PyKCkpIuD3J9smEu+dMflSKYRS7N6zj0gkSn5uLlaK+eWUAUilyDFN/rz8TaZNuabTbGvCs0mASNSFVlZ0Jb7Ij4+pRWl6JtKZbY3rtWVvxIN9qSvl5SGlJBjMZ8Wbq3jj7VUpvbV2RMffcLWkzZdSOtcJZ4DeqQE2K/52vWnzNhYvfY2CYH5a1RUinf/MU9MEkUiU8i5lPP/UY/Ts0f34YITIgpqDzClh7w1d5/Dho4yb8D22frCD3ECgzaBha0oLADgeS0NjEz26VfLgvXdw/nlD0uku67Xu3Y3MuO0O3t+8jYKCYNq1RWkDAMdjCYcdj+SiC4cx6sLh9Ko6BdMwsuOL2dKRUli2za7de3l9+Vu8/OoyotEYeXm5GSnsyggAIGmb6+sbsKXEl2O6nuzIlJSCaDSKEIJgMD9e4JuZb+/O2ItYYkChUBAQWVcGno6EcKowoPX6o1SU8TdhOxNfKZ5lctZR52TPsvP9/GskD4DL8gC4LA+Ay/IAuCwPgMvyALgsD4DL8gC4LA+Ay/IAuCwPgMvyALis/wcbJKJtVBHG1QAAAABJRU5ErkJggg==';
const instCtx=()=>MODO+':'+(slug||'-');
const instKey=()=>'hs_i_'+instCtx(),instXKey=()=>'hs_ix_'+instCtx();
const lsGet=k=>{try{return localStorage.getItem(k)}catch{return null}};
const lsSet=(k,v)=>{try{v===null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch{}};
let deferredInstall=null,installedRelated=null;
const isStandalone=()=>(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;
if(isStandalone())document.documentElement.classList.add('is-app');
const UA=navigator.userAgent,isIOS=/iPad|iPhone|iPod/.test(UA)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),isAndroid=/Android/i.test(UA),isSafari=/^((?!chrome|crios|fxios|edgios|android).)*safari/i.test(UA);
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol))window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
/* estado: 'app' (aberto como app), 'installed' (já instalado neste aparelho) ou 'none' */
function installState(){if(isStandalone())return 'app';return installedRelated||lsGet(instKey())?'installed':'none'}
function updateInstallUI(){
  const st=installState();
  document.querySelectorAll('.install-link').forEach(b=>{
    const sh=b.dataset.short,t=st=='app'?(sh?'✓ App':'✓ App instalado'):st=='installed'?(sh?'✓ App':'✓ App instalado · abrir'):(sh?'App':'Instalar app'),el=b.querySelector('.nl')||b.querySelector('span')||b;
    if(el.textContent!==t)el.textContent=t;b.classList.toggle('ok',st!='none');
  });
}
if(isStandalone())lsSet(instKey(),'1');
if(navigator.getInstalledRelatedApps)navigator.getInstalledRelatedApps().then(a=>{installedRelated=a.length>0;if(installedRelated)lsSet(instKey(),'1');updateInstallUI()}).catch(()=>{});
function ensureBanner(){let b=document.getElementById('installBanner');if(b)return b;b=document.createElement('div');b.id='installBanner';b.className='install-banner';
  b.innerHTML=`<img src="${ICON96}" alt="" width=40 height=40><div><b>Instale o app</b><span>Acesso rápido na tela inicial</span></div><button data-a=install>Instalar</button><button class=ib-x data-a=installBannerClose aria-label="Dispensar">✕</button>`;document.body.append(b);return b}
function showInstallBanner(){
  const x=Number(lsGet(instXKey())||0); // dispensado: volta a aparecer depois de 7 dias
  if(Date.now()-x<7*864e5||installState()!=='none')return;
  setTimeout(()=>{if(installState()==='none')ensureBanner().classList.add('show')},3000);
}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;installedRelated=false;lsSet(instKey(),null);updateInstallUI();showInstallBanner()});
window.addEventListener('appinstalled',()=>{deferredInstall=null;lsSet(instKey(),'1');installedRelated=true;const b=document.getElementById('installBanner');if(b)b.classList.remove('show');closeM();updateInstallUI();toast('App instalado! Procure o ícone na sua tela inicial.')});
if(isIOS)showInstallBanner();
new MutationObserver(()=>updateInstallUI()).observe(A,{childList:true,subtree:true});
const ICON_SHARE='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px"><path d="M12 3v12M8 7l4-4 4 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>';
async function openInstall(){
  const bn=document.getElementById('installBanner');if(bn)bn.classList.remove('show');
  const st=installState(),nome=(typeof S!=='undefined'&&S&&S.nome)||'Horário Salão';
  const head=`<div class=install-box><img class=install-ico src="${ICON96}" alt="" width=84 height=84><h2>Instalar o app</h2><p class=install-sub>Acesse ${esc(nome)} direto da tela inicial, como um aplicativo.</p></div>`,
        end='<button class="btn o" data-a=closem>Fechar</button>';
  if(st!=='none'&&!deferredInstall){
    openM(head+(st=='app'?'<p class=inst-note style="font-size:.9rem">✓ Você já está usando o app instalado.</p>':'<p class=inst-note style="font-size:.9rem">✓ O app já está instalado neste aparelho.</p><ol class=inst-steps><li>Abra pelo <b>ícone na tela inicial</b> ou na lista de aplicativos.</li><li>No computador, você também pode clicar em <b>Abrir no app</b> na barra de endereço do navegador.</li></ol>')+end);return}
  if(deferredInstall){const d=deferredInstall;d.prompt();const r=await d.userChoice.catch(()=>null);deferredInstall=null;if(r&&r.outcome==='accepted')return}
  let body;
  if(isIOS)body=isSafari?`<ol class=inst-steps><li>Toque no botão <b>Compartilhar</b> ${ICON_SHARE} na barra do Safari.</li><li>Role e toque em <b>Adicionar à Tela de Início</b>.</li><li>Toque em <b>Adicionar</b>. O ícone aparece na sua tela.</li></ol>`:`<ol class=inst-steps><li>Abra este site no <b>Safari</b> (o iPhone só instala apps por ele).</li><li>Toque em <b>Compartilhar</b> ${ICON_SHARE} e depois em <b>Adicionar à Tela de Início</b>.</li></ol>`;
  else if(isAndroid)body='<ol class=inst-steps><li>Toque no menu <b>⋮</b> (três pontinhos) do navegador.</li><li>Toque em <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.</li><li>Confirme em <b>Instalar</b>.</li></ol>';
  else body='<ol class=inst-steps><li>No <b>Chrome</b> ou <b>Edge</b>, clique no ícone de instalar (⊕) no final da barra de endereço, ou abra o menu <b>⋮</b> e escolha <b>Instalar app</b>.</li><li>No <b>Safari (Mac)</b>: menu <b>Arquivo → Adicionar ao Dock</b>.</li></ol><p class=inst-note>O app abre em janela própria, sem barra do navegador.</p>';
  openM(head+body+end);
}
acts.install=()=>openInstall();
acts.installBannerClose=()=>{const b=document.getElementById('installBanner');if(b)b.classList.remove('show');lsSet(instXKey(),String(Date.now()))};
/* manifesto próprio de cada tela (salão, profissional e cliente instalam como apps separados) */
function setManifest(nome,suf){
  const base=location.origin+location.pathname.replace(/[^/]*$/,''),url=location.origin+location.pathname+(slug?'?s='+encodeURIComponent(slug):''),cor=(typeof S!=='undefined'&&S&&S.cor)||'#1f2a37',n0=nome||'Horário Salão';
  const man={id:url,name:n0+(suf?' · '+suf:''),short_name:n0.slice(0,12),start_url:url,scope:base,display:'standalone',background_color:'#ffffff',theme_color:cor,lang:'pt-BR',icons:[{src:base+'icons/'+MODO+'-192.png',sizes:'192x192',type:'image/png'},{src:base+'icons/'+MODO+'-512.png',sizes:'512x512',type:'image/png'},{src:base+'icons/'+MODO+'-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]};
  document.querySelectorAll('link[rel=manifest]').forEach(l=>l.remove());
  const l=document.createElement('link');l.rel='manifest';l.href=URL.createObjectURL(new Blob([JSON.stringify(man)],{type:'application/manifest+json'}));document.head.append(l);
  const m=document.querySelector('meta[name=theme-color]');if(m)m.content=cor;
  const t=document.querySelector('meta[name=apple-mobile-web-app-title]');if(t)t.content=n0.slice(0,14);
}
if(!slug)setManifest();

/* ============ LANDING / LOGIN / CADASTRO ============ */
function landing(mode='login'){
  theme();document.title='Empresa | Horário Salão';
  A.innerHTML=`<div class="top hero" style="background:${cover()}"><h1>Horário Salão</h1><p>Seu salão com agenda online. Cadastre-se e envie o link aos seus clientes.</p><a class=cta href="#acesso">Cadastrar meu salão</a><br><a href="#!" class=install-link data-a=install style="color:#fff;font-size:.9rem;display:inline-block;margin-top:14px;text-decoration:underline">Instalar app</a></div>
  <div class=wrap><div class=card id=acesso><div class=tabs>
  <button class="${mode=='login'?'on':''}" data-a=lg>Entrar</button><button class="${mode=='cad'?'on':''}" data-a=cd>Cadastrar salão</button></div>
  ${mode=='cad'?`<label>Nome do salão</label><input id=nm placeholder="Ex.: Beleza & Estilo">
  <label>Endereço do link</label><input id=sg placeholder="beleza-estilo"><p class=mu id=pv></p>`:''}
  <label>E-mail</label><input id=em type=email><label>Senha</label><input id=pw type=password placeholder="mínimo 6 caracteres">
  <button class=btn data-a=${mode=='cad'?'signup':'login'}>${mode=='cad'?'Criar meu salão':'Entrar'}</button><p class=mu style="text-align:center;margin-top:14px">Cliente ou profissional? <a href="index.html">Acesse por aqui</a></p></div></div>`;
  if(mode=='cad'){const n=$('#nm'),s=$('#sg');n.oninput=()=>{if(!s.dataset.t)s.value=slugify(n.value);pv()};s.oninput=()=>{s.dataset.t=1;s.value=slugify(s.value);pv()};
    const pv=()=>$('#pv').textContent=s.value?BASE+'cliente.html?s='+s.value:''}
}
acts.lg=()=>landing('login');acts.cd=()=>landing('cad');
acts.login=async()=>{try{await signInWithEmailAndPassword(auth,v('em'),v('pw'))}catch(e){alert('E-mail ou senha inválidos.')}};
const mk=async(nome,sg)=>{
  const d={nome,slug:sg,cor:'#1f2a37',whats:'',end:'',abre:'09:00',fecha:'18:00',dias:[1,2,3,4,5,6],servicos:[],profissionais:[],promocoes:[]},w=writeBatch(db);
  w.set(doc(db,'slugs',sg),{uid:U.uid});w.set(doc(db,'saloes',U.uid),d);await w.commit();S=d;
};
acts.signup=async()=>{
  const nome=v('nm'),sg=slugify(v('sg'));if(!nome||!sg||!v('em')||v('pw').length<6)return alert('Preencha todos os campos (senha com 6+ caracteres).');
  busy=true;
  try{
    if((await getDoc(doc(db,'slugs',sg))).exists())throw{code:'slug',message:'Esse endereço já está em uso. Escolha outro.'};
    try{U=(await createUserWithEmailAndPassword(auth,v('em'),v('pw'))).user}
    catch(e){if(e.code=='auth/email-already-in-use')U=(await signInWithEmailAndPassword(auth,v('em'),v('pw'))).user;else throw e}
    await mk(nome,sg);
  }catch(e){busy=false;alert('Erro ao cadastrar: '+(e.code||'')+' — '+(e.message||''));if(U)panel();return}
  busy=false;panel();
};
async function semSalao(){
  theme();let cl=false;try{cl=(await getDoc(doc(db,'clientes',U.uid))).exists()}catch(e){}
  A.innerHTML=`<div class="top hero" style="background:${cover()};padding:40px 16px"><h1>Empresa</h1><p>Você está conectado como ${esc(U.email||'')}</p></div><div class=wrap><div class=card><h2>Esta conta não é de uma empresa</h2><p class=mu>${cl?'Ela foi criada como conta de <b>cliente</b>.':'Ela não tem nenhum salão cadastrado (pode ser uma conta de profissional ou de cliente).'} Para acessar o painel da empresa, saia e entre com a conta da empresa.</p><button class=btn data-a=trocar>Sair e entrar com a conta da empresa</button><button class="btn o" data-a=novosalao>Cadastrar um salão com esta conta</button><p class=mu style="text-align:center;margin-top:14px">Cliente ou profissional? <a href="index.html">Acesse por aqui</a></p></div></div>`;
}
acts.trocar=async()=>{try{await signOut(auth)}catch(e){}U=null;landing()};
acts.novosalao=()=>{theme();A.innerHTML=`<div class="top hero" style="background:${cover()};padding:40px 16px"><h1>Quase lá!</h1><p>Cadastre o seu salão com a conta ${esc(U.email||'')}</p></div><div class=wrap><div class=card><label>Nome do salão</label><input id=nm><label>Endereço do link</label><input id=sg placeholder="ex.: barbearia-martins"><button class=btn data-a=criar>Criar meu salão</button><button class="btn o" data-a=trocar>Entrar com outra conta</button></div></div>`};
acts.criar=async()=>{
  const nome=v('nm'),sg=slugify(v('sg')||nome);if(!nome||!sg)return alert('Informe o nome do salão.');
  try{if((await getDoc(doc(db,'slugs',sg))).exists())return alert('Esse endereço já está em uso. Escolha outro.');await mk(nome,sg);panel()}
  catch(e){alert('Erro: '+(e.code||'')+' — '+(e.message||''))}
};

/* ============ PAINEL DO SALÃO ============ */
const save=()=>setDoc(doc(db,'saloes',U.uid),S);
let FIRSTSNAP=true;
function listen(){if(UNSUB)UNSUB();FIRSTSNAP=true;const c=collection(db,'saloes',OID,'agendamentos');
  UNSUB=onSnapshot(ROLE=='prof'?query(c,where('prof','==',ME)):c,snap=>{
    AGALL=snap.docs.map(d=>({id:d.id,...d.data()}));LOADED=true;
    if(!FIRSTSNAP)snap.docChanges().forEach(x=>{const o=x.doc.data();const w8=fd(o.data)+' às '+o.hora;if(x.type=='added')notify((ROLE=='prof'?'Novo agendamento para você: ':'Novo agendamento: ')+o.nome+' · '+w8,'lista');if(x.type=='modified'&&o.pstatus=='aguardando'&&ROLE!='prof')notify('Comprovante recebido de '+o.nome,'pag');if(x.type=='removed'){const n=ROLE=='prof'?0:ESP.filter(e=>e.data==o.data&&e.status=='aguardando').length;notify('Agendamento cancelado: '+o.nome+' · '+w8+(n?' — '+n+' na lista de espera nesse dia':' — horário liberado'),n?'esp':'lista')}});
    FIRSTSNAP=false;
    if(['dash','cal','lista','cli','pag','pdash','fin','pgan'].includes(TAB)&&!$('#mo')&&!/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||''))draw();
  },e=>console.log('listener',e.code))}
async function panel(){
  S=(await getDoc(doc(db,'saloes',U.uid))).data();
  if(!S){await semSalao();return}
  S.cupons=S.cupons||[];S.locais=S.locais||[];OID=U.uid;ROLE='owner';
  try{(await getDocs(collection(db,'saloes',OID,'agendas'))).docs.forEach(d=>{const p=S.profissionais.find(x=>x.id==d.id);if(p){p.hor=d.data().hor||undefined;p.folgas=d.data().folgas||[]}})}catch(e){}
  try{ACC=(await getDocs(collection(db,'saloes',OID,'acessos'))).docs.map(d=>({email:d.id,profId:d.data().profId}))}catch(e){ACC=[]}
  theme(S.cor);try{const q=await getDocs(collection(db,'saloes',U.uid,'notas'));NOTAS={};q.docs.forEach(d=>NOTAS[d.id]=d.data())}catch(e){}
  try{PRIV=(await getDoc(doc(db,'saloes',OID,'privado','comissoes'))).data()||{map:{}}}catch(e){PRIV={map:{}}}
  try{const q=await getDocs(collection(db,'saloes',OID,'comissaoPct')),have={};q.docs.forEach(d=>{have[d.id]=1;PRIV.map=PRIV.map||{};PRIV.map[d.id]=+d.data().pct||0});for(const k of Object.keys(PRIV.map||{}))if(!have[k]){try{await setDoc(doc(db,'saloes',OID,'comissaoPct',k),{pct:+PRIV.map[k]||0})}catch(e){}}}catch(e){}
  try{COMP={};(await getDocs(collection(db,'saloes',OID,'comissoes'))).docs.forEach(d=>COMP[d.id]=d.data())}catch(e){}
  applyTema(S.tema);setManifest(S.nome,'Gestão');ntLoad();listenEsp();listen();draw();
}
const link=()=>BASE+'cliente.html?s='+S.slug;
const fmtM=n=>'R$ '+(+n||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const parseM=x=>(+String(x==null?'':x).replace(/\D/g,''))/100;
const act=x=>x.ativo!==false;
const resumo=h=>h.dias.map(d=>DIAS[d]).join(', ')+' · '+h.abre+'–'+h.fecha+(h.almI&&h.almF?' · almoço '+h.almI+'–'+h.almF:' · sem pausa');
const hrsOf=id=>{const p=S.profissionais.find(x=>x.id==id),f=(p&&p.folgas)||[];return p&&p.hor?{...p.hor,folgas:f}:{abre:S.abre,fecha:S.fecha,almI:S.almI,almF:S.almF,dias:S.dias,folgas:f}};
const lrow=(l,i,t,on)=>`<div class=row style="align-items:flex-start;gap:10px;${on===false?'opacity:.6':''}"><span>${t} ${on===false?'<span class="tag tg-i">Inativo</span>':'<span class="tag tg-f">Ativo</span>'}</span><span class=acn><button class="btn s o" data-a=ed data-l=${l} data-i=${i}>Editar</button><button class="btn s o" data-a=tgl data-l=${l} data-i=${i}>${on===false?'Ativar':'Inativar'}</button><button class="btn s o" style="color:#c33;border-color:#c33" data-a=del data-l=${l} data-i=${i}>Excluir</button></span></div>`;
const sopts=sel=>S.servicos.filter(act).map(s=>`<option value="${s.id}" ${sel==s.id?'selected':''}>${esc(s.nome)}</option>`).join('');
const syncPerfil=()=>{if($('#p1')){S.nome=v('p1');S.whats=v('p2');S.end=v('p3');S.titulo=v('p5');S.sub=v('p6')}};
const profHor=(p,i)=>{const h=p.hor,x=h||S;return `<div style="border:1px solid var(--bd);border-radius:12px;padding:14px;margin-top:12px"><div style="display:flex;gap:10px;align-items:center">${avc(p.foto,p.nome,36)}<span><b>${esc(p.nome)}</b> <span class=mu>${esc(p.funcao||'')}</span>${act(p)?'':' <span class="tag tg-i">Inativo</span>'}<br><span class=mu>${resumo(hrsOf(p.id))}</span></span></div>
  <div class=dias style="margin:10px 0"><label><input type=checkbox class=pcustom data-i=${i} ${h?'checked':''}> Usar horário próprio (substitui o horário e a pausa do salão)</label></div>
  <div id=pf${i} style="display:${h?'block':'none'}"><div style="display:flex;gap:8px"><div style="flex:1"><label>Abre</label><input id=ph${i}a type=time value="${x.abre}"></div><div style="flex:1"><label>Fecha</label><input id=ph${i}b type=time value="${x.fecha}"></div></div>
  <label>Pausa de almoço (opcional)</label><div style="display:flex;gap:8px"><input id=ph${i}c type=time value="${x.almI||''}"><input id=ph${i}d type=time value="${x.almF||''}"></div>
  <label>Dias de atendimento (os desmarcados são folga)</label><div class=dias>${DIAS.map((d,k)=>`<label><input type=checkbox class=pdia${i} value=${k} ${x.dias.includes(k)?'checked':''}>${d}</label>`).join('')}</div></div>
  <label>Folgas e dias bloqueados</label><div style="display:flex;gap:8px"><input id=fd${i} type=date><button class="btn s o" data-a=fadd data-i=${i}>Bloquear dia</button></div><div class=chips style="margin-top:8px">${(p.folgas||[]).slice().sort().map(d=>`<span>${fd(d)} <button class=x data-a=fdel data-i=${i} data-d=${d}>✕</button></span>`).join('')}</div><button class="btn s" style="margin-top:12px" data-a=salph data-i=${i}>Salvar agenda de ${esc(p.nome)}</button></div>`};
function cadPage(){
  let c='';const es=E('servicos'),ep=E('profissionais'),eo=E('promocoes'),bt=(e,a)=>`<button class="btn s" data-a=${a}>${e?'Salvar alterações':'Cadastrar'}</button>${e?'<button class="btn s o" data-a=noed>Cancelar edição</button>':''}`;
  const two=(t,sub,ed,form,tl,items)=>`<div class=card><h2>${t}</h2><p class=mu>${sub}</p><h3 style="margin:16px 0 2px">${ed}</h3><div class=add>${form}</div></div><div class=card><h3>${tl} (${items.length})</h3>${items.join('')||'<p class=mu style="margin-top:8px">Nenhum cadastro ainda.</p>'}</div>`;
  if(TAB=='serv')return two('Serviços','Gerencie os serviços e valores oferecidos pelo salão. Serviços inativos não aparecem para o cliente.',es?'Editar serviço':'Cadastrar novo serviço',
    `<label>Nome do serviço</label><input id=a1 value="${esc(es?.nome)}"><label>Valor</label><input id=a2 data-money inputmode=numeric placeholder="R$ 0,00" value="${es?fmtM(es.preco):''}"><label>Duração</label><select id=a3>${[15,30,45,60,75,90,105,120,150,180,240].map(m=>`<option value=${m} ${(es?.min||30)==m?'selected':''}>${m} min</option>`).join('')}</select><label>Categoria (opcional)</label><input id=a4 value="${esc(es?.cat)}"><label>Descrição (opcional)</label><input id=a5 value="${esc(es?.desc)}">${bt(es,'addserv')}`,
    'Serviços cadastrados',S.servicos.map((s,i)=>lrow('servicos',i,`<b>${esc(s.nome)}</b><br><span class=mu>${brl(s.preco)} · ${s.min}min${s.cat?' · '+esc(s.cat):''}</span>`,s.ativo)));
  if(TAB=='prof')return profAcessoCard()+two('Profissionais','Gerencie a equipe. Profissionais inativos não aparecem para o cliente.',ep?'Editar profissional':'Cadastrar novo profissional',
    `<label>Nome</label><input id=a1 value="${esc(ep?.nome)}"><label>Função</label><input id=a2 placeholder="Ex.: Barbeiro" value="${esc(ep?.funcao)}"><label>Foto (opcional)</label><input type=file accept="image/*" data-up=foto><img id=fp src="${ep?.foto||''}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;display:${ep?.foto?'block':'none'}"><label>Serviços que realiza <span class=mu>(nenhum marcado = todos)</span></label><div class=dias>${S.servicos.map(x=>`<label><input type=checkbox class=ps value="${x.id}" ${ep?.servs?.includes(x.id)?'checked':''}>${esc(x.nome)}</label>`).join('')||'<span class=mu>Cadastre serviços primeiro.</span>'}</div>${S.locais.length?`<label>Locais de atendimento <span class=mu>(nenhum marcado = todos)</span></label><div class=dias>${S.locais.map(l=>`<label><input type=checkbox class=pl value="${l.id}" ${ep?.locais?.includes(l.id)?'checked':''}>${esc(l.nome)}</label>`).join('')}</div>`:''}<label>E-mail de acesso ao painel profissional <span class=mu>(opcional)</span></label><input id=a6 type=email placeholder="profissional@email.com" value="${esc(ep?accOf(ep.id):'')}"><p class=mu style="margin:0">O profissional cria a senha em "Painel profissional", na página do salão, usando este e-mail, e confirma o e-mail.</p><label>Comissão (%) <span class=mu>(opcional — só você vê)</span></label><input id=a7 type=number min=0 max=100 step=0.5 value="${ep?((PRIV.map||{})[ep.id]??''):''}">${bt(ep,'addprof')}`,
    'Profissionais cadastrados',S.profissionais.map((p,i)=>lrow('profissionais',i,`<span style="display:flex;gap:10px;align-items:center">${avc(p.foto,p.nome,40)}<span><b>${esc(p.nome)}</b> · ${esc(p.funcao||'')}<br><span class=mu>${p.servs&&p.servs.length?p.servs.length+' serviço(s)':'todos os serviços'}${p.hor?' · horário próprio':''}<br>${resumo(hrsOf(p.id))}${accOf(p.id)?'<br>🔑 '+esc(accOf(p.id)):''}${(PRIV.map||{})[p.id]?'<br>💰 comissão '+PRIV.map[p.id]+'%':''}</span></span></span>`,p.ativo)));
  if(TAB=='promo')return two('Promoções','Crie descontos por serviço. Promoções inativas não são aplicadas.',eo?'Editar promoção':'Cadastrar nova promoção',
    `<label>Título</label><input id=a1 placeholder="Ex.: Terça do Corte" value="${esc(eo?.titulo)}"><label>Desconto (%)</label><input id=a2 type=number min=1 max=90 value="${eo?.pct??''}"><label>Vale para</label><select id=a3><option value="">Todos os serviços</option>${sopts(eo?.servId)}</select>${bt(eo,'addpromo')}`,
    'Promoções cadastradas',S.promocoes.map((p,i)=>lrow('promocoes',i,`<b>${esc(p.titulo)}</b><br><span class=mu>${p.pct}% off · ${p.servId?esc((S.servicos.find(s=>s.id==p.servId)||{}).nome||'serviço removido'):'todos os serviços'}</span>`,p.ativo)));
  if(TAB=='cup'){const ec=E('cupons');return two('Cupons de desconto','Crie códigos que o cliente digita na etapa de pagamento. Cupons inativos não funcionam.',ec?'Editar cupom':'Cadastrar novo cupom',`<label>Código</label><input id=a1 placeholder="Ex.: BEMVINDO10" value="${esc(ec?.codigo)}"><label>Desconto (%)</label><input id=a2 type=number min=1 max=90 value="${ec?.pct??''}">${bt(ec,'addcup')}`,'Cupons cadastrados',S.cupons.map((c,i)=>lrow('cupons',i,`<b>${esc(c.codigo)}</b><br><span class=mu>${c.pct}% de desconto</span>`,c.ativo)))}
  if(TAB=='loc'){const el=E('locais');return two('Unidades','Cadastre mais de um local de atendimento. Com 2 ou mais unidades ativas, o cliente escolhe o local ao agendar.',el?'Editar unidade':'Cadastrar nova unidade',`<label>Nome</label><input id=a1 value="${esc(el?.nome)}"><label>Endereço</label><input id=a2 value="${esc(el?.end)}">${bt(el,'addloc')}`,'Unidades cadastradas',S.locais.map((l,i)=>lrow('locais',i,`<b>${esc(l.nome)}</b><br><span class=mu>${esc(l.end||'')}</span>`,l.ativo)))}
  if(TAB=='hor')return `<div class=card><h2>Horário de funcionamento</h2><p class=mu>Horário geral do salão: ${resumo(S)} · horários de ${S.passo||30} em ${S.passo||30} min</p><label>Abre</label><input id=h1 type=time value="${S.abre}"><label>Fecha</label><input id=h2 type=time value="${S.fecha}"><label>Intervalo entre horários <span class=mu>(de quanto em quanto tempo o cliente pode agendar)</span></label><select id=h5>${[15,30,45,60,90,120].map(m=>`<option value=${m} ${(S.passo||30)==m?'selected':''}>${m} minutos</option>`).join('')}</select><p class=mu style="margin-top:4px">Ex.: 45 minutos → 09:00, 09:45, 10:30… Serviços mais longos ocupam vários intervalos.</p><label>Pausa de almoço <span class=mu>(opcional)</span></label><div style="display:flex;gap:8px"><input id=h3 type=time value="${S.almI||''}"><input id=h4 type=time value="${S.almF||''}"></div>
   <label>Dias de atendimento</label><div class=dias>${DIAS.map((d,i)=>`<label><input type=checkbox class=dia value=${i} ${S.dias.includes(i)?'checked':''}>${d}</label>`).join('')}</div><button class=btn data-a=salhor>Salvar horários do salão</button></div>
   <div class=card><h2>Agenda de cada profissional</h2><p class=mu>Defina horário e folgas por profissional. Quem não tiver horário próprio segue o horário do salão.</p>${S.profissionais.map(profHor).join('')||'<p class=mu>Cadastre profissionais primeiro.</p>'}</div>`;
  if(TAB=='perfil'){
    const grp=(g,t)=>`<p class=mu style="margin:12px 0 4px"><b>${t}</b></p><div class=pgrid>${Object.keys(CAPAS).filter(k=>CAPAS[k].g==g).map(k=>`<div class="cpv ${!S.capa&&S.capaK==k?'on':''}" data-a=capak data-k=${k} style="background:${CAPAS[k].css}"><span>${CAPAS[k].n}</span></div>`).join('')}</div>`;
    return `<div class=card><h2>Dados do salão</h2><label>Nome</label><input id=p1 value="${esc(S.nome)}"><label>WhatsApp (com DDD)</label><input id=p2 value="${esc(S.whats)}" placeholder="61999999999"><label>Endereço</label><input id=p3 value="${esc(S.end)}"><label>Título da capa</label><input id=p5 value="${esc(S.titulo)}" placeholder="Ex.: Estilo e tradição"><label>Subtítulo da capa</label><input id=p6 value="${esc(S.sub)}" placeholder="Ex.: Agende seu horário em poucos cliques."><label>Cor do app</label><div class=dias>${PAL.map(c=>`<button type=button data-a=preset data-c=${c} style="width:38px;height:38px;border-radius:50%;border:3px solid ${c==S.cor?'#000':'#fff'};background:${c};box-shadow:0 0 0 1px #ccc;cursor:pointer"></button>`).join('')}</div><input id=p4 type=color value="${S.cor}" style="margin-top:10px;height:42px"><button class=btn data-a=salperfil>Salvar dados</button></div>
    <div class=card><h2>Capa da página</h2><p class=mu>Escolha uma capa pronta ou envie a sua imagem.</p>
    <div class=pgrid style="margin-top:8px"><div class="cpv ${!S.capa&&!S.capaK?'on':''}" data-a=capak data-k="" style="background:url('${DEF}') center/cover"><span>Foto padrão</span></div></div>${grp('b','Estilo barbearia')}${grp('s','Estilo salão de beleza')}
    <label style="margin-top:14px">Enviar minha imagem ${S.capa?'<span class=mu>(em uso)</span>':''}</label><input type=file accept="image/*" data-up=capa>${S.capa?'<button class="btn s o" style="margin-top:6px" data-a=dcapa>Remover minha imagem</button>':''}
    <label>Logo</label>${S.logo?`<img src="${S.logo}" style="height:50px;display:block;margin-bottom:6px;background:#ddd;padding:4px;border-radius:6px">`:''}<input type=file accept="image/*" data-up=logo>${S.logo?'<button class="btn s o" style="margin-top:6px" data-a=dlogo>Remover logo</button>':''}</div>
    <div class=card><h2>Estilo do sistema</h2><p class=mu>Escolha a aparência do painel e da página de agendamento. O padrão é o estilo atual.</p><div class=pgrid style="margin-top:8px">${Object.keys(TEMAS).map(k=>`<div class="cpv ${(S.tema||'padrao')==k?'on':''}" data-a=tema data-t=${k} style="background:linear-gradient(135deg,${TEMAS[k][1]} 55%,${TEMAS[k][3]} 55%);height:64px"><span>${TEMAS[k][0]}${k=='padrao'?' (padrão)':''}</span></div>`).join('')}</div></div>`;
  }
  if(TAB=='pix')c=`<h2>Receber por PIX</h2><p class=mu>Cadastre a chave PIX do salão. No agendamento, o cliente poderá escolher pagar por PIX (QR code e copia e cola) e enviar o comprovante. A chave aparece para quem for pagar.</p>
   <div class=dias style="margin-top:10px"><label><input type=checkbox id=x0 ${S.pixOn?'checked':''}> Aceitar pagamento por PIX no agendamento</label></div>
   <label>Tipo da chave</label><select id=x1>${[['cpf','CPF'],['cnpj','CNPJ'],['tel','Celular'],['email','E-mail'],['rand','Chave aleatória']].map(x=>`<option value=${x[0]} ${(S.pixTipo||'cpf')==x[0]?'selected':''}>${x[1]}</option>`).join('')}</select>
   <label>Chave PIX</label><input id=x2 value="${esc(S.pixChave)}"><label>Nome do beneficiário <span class=mu>(como no banco, até 25 letras)</span></label><input id=x3 maxlength=25 value="${esc(S.pixNome||S.nome)}"><label>Cidade <span class=mu>(até 15 letras)</span></label><input id=x4 maxlength=15 value="${esc(S.pixCidade||'Brasilia')}"><button class=btn data-a=salpix>Salvar PIX</button>
   ${S.pixChave?'<h3 style="margin:20px 0 6px">Teste (R$ 1,00)</h3><p class=mu>Pague R$ 1,00 pelo seu banco para conferir se está tudo certo.</p><div id=pxv></div>':''}`;
  return `<div class=card>${c}</div>`}
/* ====== PAINEL: layout, dashboard, agenda, clientes ====== */
let AGALL=[],NOTAS={},UNSUB=null,LOADED=false,SIDE=false,DAYSEL=iso(new Date()),CAL={y:new Date().getFullYear(),m:new Date().getMonth()},QS='',QC='',CL=[],NV={},AGSEL=null,OPEN={agenda:true};
const MENU=[{k:'dash',t:'Dashboard',i:'📊'},{k:'agenda',t:'Agenda',i:'📅',sub:[['cal','Calendário'],['lista','Lista'],['esp','Encaixe / lista de espera'],['novo','＋ Novo agendamento']]},{k:'cli',t:'Clientes',i:'👥'},{k:'fin',t:'Financeiro',i:'💰',sub:[['fin','Resumo financeiro'],['pag','Pagamentos'],['pix','Chave PIX']]},{k:'cad',t:'Cadastros',i:'🗂️',sub:[['serv','Serviços'],['prof','Profissionais'],['promo','Promoções'],['cup','Cupons'],['loc','Unidades']]},{k:'cfg',t:'Configurações',i:'⚙️',sub:[['hor','Horários'],['perfil','Perfil e capa']]}];
const TITLES={dash:'Dashboard',cal:'Agenda · Calendário',lista:'Agenda · Lista',cli:'Clientes',pag:'Financeiro · Pagamentos',pdash:'Meu painel de controle',pgan:'Meus ganhos e pagamentos',fin:'Financeiro · Resumo',esp:'Agenda · Encaixe / lista de espera',pcfg:'Minhas configurações',cup:'Cupons de desconto',loc:'Unidades',pix:'Financeiro · Chave PIX',serv:'Serviços',prof:'Profissionais',promo:'Promoções',hor:'Horários',perfil:'Perfil e capa'};
const MES=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const fd=d=>d.split('-').reverse().join('/');
const stOf=a=>a.status||((a.data+' '+a.hora)<(iso(new Date())+' '+hm(new Date().getHours()*60+new Date().getMinutes()))?'ps':'ag');
const stag=a=>{const s=stOf(a);return`<span class="tag tg-${{ag:'n',concluido:'f',faltou:'i',ps:'r'}[s]}">${{ag:'Agendado',concluido:'Concluído',faltou:'Faltou',ps:'Passou'}[s]}</span>`};
const openM=h=>{closeM();const d=document.createElement('div');d.className='mo';d.id='mo';d.innerHTML=`<div class=md>${h}</div>`;d.addEventListener('mousedown',e=>{if(e.target==d)closeM()});document.body.append(d)};
const closeM=()=>{const m=$('#mo');if(m)m.remove()};
async function loadAll(){if(LOADED)return;const c=collection(db,'saloes',OID,'agendamentos'),q=await getDocs(ROLE=='prof'?query(c,where('prof','==',ME)):c);AGALL=q.docs.map(d=>({id:d.id,...d.data()}));LOADED=true}

async function draw(){
  const P=ROLE=='prof';document.body.classList.add('in-panel');
  if(['dash','cal','lista','cli','pag','pdash','fin','esp','pgan'].includes(TAB)){try{await loadAll();if(P&&TAB=='pdash')await loadBusyP();if(TAB=='esp')await loadEspSlots()}catch(e){alert('Não foi possível carregar a agenda: '+(e.code||e.message))}}
  const c=P?(TAB=='pdash'?pdash():TAB=='cal'?cal():TAB=='lista'?lista():TAB=='cli'?cliPage():TAB=='pgan'?ganPage():pcfg()):(TAB=='dash'?dash():TAB=='cal'?cal():TAB=='lista'?lista():TAB=='cli'?cliPage():TAB=='pag'?pagPage():TAB=='fin'?finPage():TAB=='esp'?espPage():cadPage());
  const MN=P?MENUP:MENU,gk=(MN.find(m=>m.sub&&m.sub.some(x=>x[0]==TAB))||{}).k||'',ni=k=>`<span class=ni>${ico(k)}</span>`;
  const nav=MN.map(m=>m.sub?`<div class="grp ${m.k==OPENG?'open':''} ${m.k==gk?'act':''}" data-g=${m.k}><button class="nv gh" data-a=tog data-k=${m.k} aria-expanded="${m.k==OPENG}" title="${m.t}">${ni(ICK[m.k])}<span class=nl>${m.t}</span><span class=chev>${ico('chev')}</span></button><div class=sub><div class=subin>${m.sub.map(x=>`<button class="nv si ${TAB==x[0]?'on':''}" data-a=nav data-k=${x[0]}><span class=dot></span><span class=nl>${x[1]}</span></button>`).join('')}</div></div></div>`:`<button class="nv top ${TAB==m.k?'on':''}" data-a=nav data-k=${m.k} title="${m.t}">${ni(ICK[m.k])}<span class=nl>${m.t}</span></button>`).join('');
  const sf=(P?`<button class=nv data-a=pvolta title="Voltar ao início">${ni('home')}<span class=nl>Voltar ao início</span></button>`:`<button class=nv data-a=copy title="Copiar link do cliente">${ni('link')}<span class=nl>Copiar link do cliente</span></button><a class=nv href="${link()}" target=_blank title="Ver página do cliente">${ni('eye')}<span class=nl>Ver página do cliente</span></a><a class=nv href="${profLink()}" target=_blank title="Ver página do profissional">${ni('eye')}<span class=nl>Ver página do profissional</span></a>`)+`<button class="nv install-link" data-a=install title="Instalar app">${ni('down')}<span class=nl>Instalar app</span></button><button class=nv data-a=sair title="Sair">${ni('out')}<span class=nl>Sair</span></button><button class="nv mini-btn" data-a=mini title="Recolher menu">${ni('panel')}<span class=nl>Recolher menu</span></button>`;
  const me=P?S.profissionais.find(x=>x.id==ME):null;
  A.innerHTML=`<div class=app><main class=main><div class=ban style="background:${cover(S.capa,S.capaK)}">${S.logo?`<img class=lg src="${S.logo}" style="height:46px;margin:0">`:''}<div><h1>${esc(S.nome)}</h1><p>${P&&me?esc(me.nome)+' · ':''}${TITLES[TAB]}</p></div><button class=bell id=bell data-a=bell>${bellHtml()}</button><button class=burger data-a=menu>☰</button></div><div class=pg>${c}</div></main>
  <aside class="side ${SIDE?'open':''} ${SMINI?'mini':''}" id=side><div class=sb>${P?'Painel do profissional':esc(S.nome)}</div><nav>${nav}</nav><div class=sf>${sf}</div></aside><div class=ov data-a=menu></div></div>`;
  if(TAB=='pix'&&S.pixChave)showPix($('#pxv'),1,'TESTE',false);
}
acts.menu=()=>{SIDE=!SIDE;$('#side').classList.toggle('open',SIDE)};
let OPENG='',SMINI=lsGet('hs_mini')=='1';
const ICK={dash:'dash',agenda:'cal',cli:'users',fin:'wallet',cad:'folder',cfg:'cog',pdash:'dash',cal:'cal',lista:'list',pgan:'wallet',pcfg:'cog'};
const ICS={dash:'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
 cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 users:'<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>',
 wallet:'<path d="M20 12V8a2 2 0 00-2-2H5a2 2 0 010-4h12v4"/><path d="M3 5v14a2 2 0 002 2h15a1 1 0 001-1v-4"/><path d="M18 12a2 2 0 000 4h4v-4z"/>',
 folder:'<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>',
 cog:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/>',
 list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
 link:'<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>',
 eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
 down:'<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
 out:'<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>',
 home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
 panel:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>',
 chev:'<path d="M9 18l6-6-6-6"/>'};
const ico=k=>`<svg viewBox="0 0 24 24" aria-hidden="true">${ICS[k]||''}</svg>`;
const groupOf=k=>{const m=(ROLE=='prof'?MENUP:MENU).find(m=>m.sub&&m.sub.some(x=>x[0]==k));return m?m.k:''};
acts.tog=b=>{const k=b.dataset.k;if(SMINI){SMINI=false;lsSet('hs_mini',null);$('#side').classList.remove('mini');OPENG=k}else OPENG=OPENG==k?'':k;
  document.querySelectorAll('.grp').forEach(g=>{const o=g.dataset.g==OPENG;g.classList.toggle('open',o);g.querySelector('.gh').setAttribute('aria-expanded',String(o))})};
acts.mini=()=>{SMINI=!SMINI;lsSet('hs_mini',SMINI?'1':null);$('#side').classList.toggle('mini',SMINI)};
acts.nav=async b=>{SIDE=false;const k=b.dataset.k;if(k=='novo'){await draw();openNovo({data:DAYSEL});return}TAB=k;OPENG=groupOf(k);EDIT=null;TMP={};draw();scrollTo(0,0)};

/* ---- Dashboard ---- */
function dash(){
  const now=new Date(),hoje=iso(now),mes=hoje.slice(0,7),day=n=>iso(new Date(now.getTime()+n*864e5)),ok=a=>a.status!='faltou';
  const dH=AGALL.filter(a=>a.data==hoje&&ok(a)).sort((a,b)=>a.hora.localeCompare(b.hora)),p7=AGALL.filter(a=>a.data>=hoje&&a.data<=day(7)&&ok(a)).length,
  dm=AGALL.filter(a=>a.data.startsWith(mes)),dmo=dm.filter(ok),rec=dm.reduce((t,a)=>t+(a.pvalor||0),0),fat=dmo.reduce((t,a)=>t+(a.valor||0),0),cl=clientes(),novos=cl.filter(c=>c.desde.startsWith(mes)).length,
  nx=[...Array(14)].map((_,i)=>({d:day(i),n:AGALL.filter(a=>a.data==day(i)&&ok(a)).length})),mx=Math.max(1,...nx.map(x=>x.n));
  const top=f=>{const c={};AGALL.filter(ok).forEach(a=>{const k=f(a);c[k]=c[k]||{n:0,v:0};c[k].n++;c[k].v+=a.valor||0});return Object.entries(c).sort((a,b)=>b[1].n-a[1].n).slice(0,5)};
  const hb=L=>{const m=Math.max(1,...L.map(x=>x[1].n));return L.map(x=>`<div style="margin:9px 0"><div style="display:flex;justify-content:space-between;font-size:.88rem"><span>${esc(x[0])}</span><span class=mu>${x[1].n} · ${brl(x[1].v)}</span></div><div style="background:#eee;border-radius:6px;height:8px"><div style="background:var(--c);height:8px;border-radius:6px;width:${x[1].n/m*100}%"></div></div></div>`).join('')||'<p class=mu>Sem dados ainda.</p>'};
  return `${addrCard()}
  <div class=kp>${[['Hoje',dH.length],['Próximos 7 dias',p7],['Faturamento previsto',brl(fat)],['Recebido no mês',brl(rec)],['Comprovantes a conferir',AGALL.filter(a=>a.pstatus=='aguardando').length],['Ticket médio',brl(dmo.length?fat/dmo.length:0)],['Clientes',cl.length],['Novos no mês',novos],['Faltas no mês',dm.length-dmo.length]].map(k=>`<div><span>${k[0]}</span><b>${k[1]}</b></div>`).join('')}</div>
  <div class=g2>${desemp(AGALL)}<div class=card><h2>Agenda de hoje</h2>${dH.map(a=>`<div class=row style="cursor:pointer" data-a=agd data-id=${a.id}><span><b>${a.hora}</b> · ${esc(a.nome)}<br><span class=mu>${esc(a.servico)} com ${esc(a.profNome)}</span></span>${stag(a)}</div>`).join('')||'<p class=mu>Nenhum agendamento hoje.</p>'}<button class="btn s" style="margin-top:12px" data-a=novoday2>＋ Novo agendamento</button></div>
  <div class=card><h2>Próximos 14 dias</h2><div class=bars>${nx.map(x=>`<i style="height:${Math.max(3,x.n/mx*100)}%" title="${fd(x.d)}: ${x.n}"></i>`).join('')}</div><div class=bl>${nx.map(x=>`<span>${x.d.slice(8)}</span>`).join('')}</div></div>
  <div class=card><h2>Serviços mais vendidos</h2>${hb(top(a=>a.servico))}</div><div class=card><h2>Profissionais</h2>${hb(top(a=>a.profNome))}</div></div>`;
}
const addrCard=()=>`<div class=card style="margin-top:0"><h2>Endereços do sistema</h2><p class=mu>Cada acesso tem o seu próprio endereço e tela.</p>${[['Cliente','para seus clientes agendarem',link(),'copy'],['Profissional','para sua equipe acompanhar a agenda',profLink(),'copyp'],['Empresa','painel de gestão (só você)',BASE+'empresa.html','copye']].map(a=>`<div class=addr><b>${a[0]}</b> <span class=mu>— ${a[1]}</span><input readonly value="${a[2]}" onclick="this.select()"><div class=aca><button class="btn s" data-a=${a[3]}>Copiar</button><a class="btn s o" style="text-decoration:none" target=_blank href="${a[2]}">Abrir</a>${a[0]=='Cliente'?'<button class="btn s o" data-a=zap>Enviar por WhatsApp</button>':''}</div></div>`).join('')}</div>`;
acts.copye=()=>navigator.clipboard.writeText(BASE+'empresa.html').then(()=>toast('Link da empresa copiado ✔'));
acts.novoday2=()=>{DAYSEL=iso(new Date());openNovo({data:DAYSEL})};
acts.zap=()=>open('https://api.whatsapp.com/send?text='+encodeURIComponent('Agende seu horário no '+S.nome+': '+link()),'_blank');

/* ---- Calendário + dia ---- */
function cal(){
  const {y,m}=CAL,start=new Date(y,m,1).getDay(),dim=new Date(y,m+1,0).getDate(),hoje=iso(new Date()),cnt={};
  AGALL.forEach(a=>{if(a.status!='faltou')cnt[a.data]=(cnt[a.data]||0)+1});
  let cells=DIAS.map(d=>`<div class=h>${d}</div>`).join('')+'<div></div>'.repeat(start);
  for(let d=1;d<=dim;d++){const ds=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;cells+=`<div class="d ${ds==DAYSEL?'on':''} ${ds==hoje?'hj':''}" data-a=pday data-d=${ds}><b>${d}</b>${cnt[ds]?`<br><span class=badge>${cnt[ds]}</span>`:''}</div>`}
  return `<div class=card style="margin-top:0"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><button class="btn s o" data-a=cprev>‹</button><b>${MES[m]} ${y}</b><button class="btn s o" data-a=cnext>›</button></div><div class=cal>${cells}</div></div>
  <div class=card id=dayc><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px"><h2 style="margin:0">${fd(DAYSEL)} · ${DIAS[new Date(DAYSEL+'T12:00').getDay()]}</h2>${ROLE=='prof'?'':'<button class="btn s" data-a=novoday>＋ Agendar neste dia</button>'}</div><p class=mu style="margin:6px 0 10px">Clique em um horário vazio (＋) para agendar, ou em um agendamento para ver os detalhes.</p><div style="overflow:auto">${dayGrid(DAYSEL)}</div></div>`;
}
function dayGrid(d){
  const wd=wdOf(d),PP=ROLE=='prof'?S.profissionais.filter(p=>p.id==ME):S.profissionais.filter(act),P=PP.length?PP:[{id:'',nome:'Geral'}],H=P.map(p=>p.id?hrsOf(p.id):S);
  const t0=Math.min(...H.map(h=>tm(h.abre))),t1=Math.max(...H.map(h=>tm(h.fecha))),ps=S.passo||30,rm=ps%30==0?30:15;
  if(!H.some(h=>h.dias.includes(wd)))return '<p class=mu>Ninguém atende neste dia (veja Configurações › Horários).</p>';
  const rows=Math.max(1,Math.ceil((t1-t0)/rm)),ags=AGALL.filter(a=>a.data==d);
  let h=`<div class=tl style="grid-template-columns:52px repeat(${P.length},minmax(120px,1fr));grid-template-rows:auto repeat(${rows},${rm==15?'26px':'38px'})"><div></div>${P.map(p=>`<div style="text-align:center;font-weight:600;font-size:.85rem;padding-bottom:4px">${esc(p.nome)}</div>`).join('')}`;
  for(let r=0;r<rows;r++)h+=`<div class=t style="grid-row:${r+2};grid-column:1">${(r*rm)%30==0||rm==30?hm(t0+r*rm):''}</div>`;
  P.forEach((p,ci)=>{const cov={},x=H[ci];
    ags.filter(a=>a.prof==p.id).forEach(a=>{const r0=Math.round((tm(a.hora)-t0)/rm),n=Math.min(Math.max(1,Math.ceil(durOf(a)/rm)),rows-r0);if(r0<0||r0>=rows)return;
      h+=`<div class="ap ${{ag:'',concluido:'ok',faltou:'no',ps:'ps'}[stOf(a)]}" style="grid-row:${r0+2}/span ${n};grid-column:${ci+2}" data-a=agd data-id=${a.id}><b>${a.hora}</b> ${esc(a.nome)}<br>${esc(a.servico)}</div>`;for(let k=0;k<n;k++)cov[r0+k]=1});
    for(let r=0;r<rows;r++){if(cov[r])continue;const fol=!x.dias.includes(wd)||(x.folgas||[]).includes(d),t=t0+r*rm,off=fol||t<tm(x.abre)||t>=tm(x.fecha),lun=x.almI&&x.almF&&t>=tm(x.almI)&&t<tm(x.almF);
      h+=off?`<div class=lun style="grid-row:${r+2};grid-column:${ci+2};background:#f3f3f3;color:#bbb">${fol&&r==0?'folga':''}</div>`:lun?`<div class=lun style="grid-row:${r+2};grid-column:${ci+2}">almoço</div>`:(t-tm(x.abre))%ps==0&&ROLE!='prof'?`<button class=e style="grid-row:${r+2};grid-column:${ci+2}" data-a=slotnew data-p="${p.id}" data-h="${hm(t)}">＋</button>`:`<div style="grid-row:${r+2};grid-column:${ci+2}"></div>`}});
  return h+'</div>';
}
acts.pday=async b=>{DAYSEL=b.dataset.d;await draw();$('#dayc').scrollIntoView({behavior:'smooth'})};
acts.cprev=()=>{CAL.m--;if(CAL.m<0){CAL.m=11;CAL.y--}draw()};
acts.cnext=()=>{CAL.m++;if(CAL.m>11){CAL.m=0;CAL.y++}draw()};
acts.novoday=()=>openNovo({data:DAYSEL});
acts.slotnew=b=>openNovo({data:DAYSEL,prof:b.dataset.p,hora:b.dataset.h});

/* ---- Lista ---- */
let LP='dia',LR=iso(new Date()),LPF='';
function lrange(){const d=new Date(LR+'T12:00'),y=d.getFullYear(),m=d.getMonth(),p=n=>String(n).padStart(2,'0'),f=(yy,mm,dd)=>`${yy}-${p(mm+1)}-${p(dd)}`,last=new Date(y,m+1,0).getDate();
  if(LP=='dia')return[LR,LR,fd(LR)+' · '+DIAS[d.getDay()]];
  if(LP=='quinz'){const a=d.getDate()<=15;return[f(y,m,a?1:16),f(y,m,a?15:last),(a?'1ª':'2ª')+' quinzena de '+MES[m]+' '+y]}
  if(LP=='mes')return[f(y,m,1),f(y,m,last),MES[m]+' '+y];
  return[f(y,0,1),f(y,11,31),String(y)]}
function lista(){
  return `<div class=card style="margin-top:0"><div class=tabs>${[['dia','Dia'],['quinz','Quinzena'],['mes','Mês'],['ano','Ano']].map(x=>`<button class="${LP==x[0]?'on':''}" data-a=lp data-f=${x[0]}>${x[1]}</button>`).join('')}</div>
  <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin:12px 0"><button class="btn s o" data-a=lnav data-n=-1>‹</button><b style="text-align:center">${lrange()[2]}</b><button class="btn s o" data-a=lnav data-n=1>›</button></div>
  <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn s o" data-a=lhoje>Hoje</button>${ROLE=='prof'?'':`<select id=lpf style="width:auto;flex:1;min-width:150px"><option value="">Todos os profissionais</option>${S.profissionais.map(p=>`<option value="${p.id}" ${LPF==p.id?'selected':''}>${esc(p.nome)}</option>`).join('')}</select>`}</div>
  <input id=qs placeholder="Buscar cliente, serviço ou profissional" value="${esc(QS)}" style="margin:10px 0"><div id=lst>${listaRows()}</div></div>`;
}
function listaRows(){
  const [a0,a1]=lrange(),q=QS.toLowerCase();
  let L=AGALL.filter(a=>a.data>=a0&&a.data<=a1&&(!LPF||a.prof==LPF));
  if(q)L=L.filter(a=>(a.nome+' '+a.servico+' '+a.profNome+' '+a.tel).toLowerCase().includes(q));
  L.sort((a,b)=>(a.data+a.hora).localeCompare(b.data+b.hora));
  const ok=L.filter(a=>a.status!='faltou'),tot=ok.reduce((t,a)=>t+(a.valor||0),0),rec=L.reduce((t,a)=>t+(a.pvalor||0),0);
  let h=`<p class=mu style="margin:4px 0 8px"><b>${L.length}</b> agendamento(s) · previsto <b>${brl(tot)}</b> · recebido <b>${brl(rec)}</b></p>`;
  if(!L.length)return h+'<p class=mu>Nenhum agendamento neste período.</p>';
  let last='';L.forEach(a=>{if(a.data!=last){last=a.data;h+=`<div style="font-weight:700;margin:14px 0 4px;color:var(--c)">${fd(a.data)} · ${DIAS[new Date(a.data+'T12:00').getDay()]}</div>`}
    h+=`<div class=row style="cursor:pointer" data-a=agd data-id=${a.id}><span><b>${a.hora}</b> · ${esc(a.nome)}<br><span class=mu>${esc(a.servico)} com ${esc(a.profNome)} · ${brl(a.valor)}</span></span><span style="text-align:right">${stag(a)}<br>${ptag(a)}</span></div>`});
  return h;
}
acts.lp=b=>{LP=b.dataset.f;draw()};
acts.lhoje=()=>{LR=iso(new Date());draw()};
acts.lnav=b=>{const n=+b.dataset.n,d=new Date(LR+'T12:00');
  if(LP=='dia')d.setDate(d.getDate()+n);
  else if(LP=='quinz'){if(n>0){if(d.getDate()<=15)d.setDate(16);else d.setMonth(d.getMonth()+1,1)}else{if(d.getDate()>15)d.setDate(1);else d.setMonth(d.getMonth()-1,16)}}
  else if(LP=='mes')d.setMonth(d.getMonth()+n,1);else d.setFullYear(d.getFullYear()+n);
  LR=iso(d);draw()};

/* ---- Detalhe do agendamento ---- */
acts.agd=b=>{const a=AGALL.find(x=>x.id==b.dataset.id);if(!a)return;AGSEL=a;if(ROLE=='prof')return agdProf(a);const k=(a.tel||'').replace(/\D/g,''),ps=pOf(a);
  openM(`<h2>${esc(a.servico)}</h2><p><b>${fd(a.data)} às ${a.hora}</b> com ${esc(a.profNome)} ${stag(a)}</p><p style="margin-top:8px">${esc(a.nome)} · ${esc(a.tel)}<br>Valor: <b>${brl(a.valor)}</b>${a.por=='salao'?' · criado pelo salão':''}${a.obs?`<br>💬 ${esc(a.obs)}`:''}${a.localNome?`<br>📍 ${esc(a.localNome)}`:''}${a.cupom?`<br>🏷 Cupom ${esc(a.cupom)} (−${a.desconto}%)`:''}</p>
  ${payBlock(a)}
  <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:14px"><button class="btn s" data-a=stset data-s=concluido>✔ Concluído</button><button class="btn s o" data-a=stset data-s=faltou>Faltou</button>${a.status?'<button class="btn s o" data-a=stset data-s="">Reabrir</button>':''}<a class="btn s o" style="text-decoration:none" target=_blank href="${wa(a.tel)}">WhatsApp</a><button class="btn s o" data-a=cperfil data-k=${k}>Ver cliente</button><button class="btn s o" style="color:#c33;border-color:#c33" data-a=acancel>Cancelar agendamento</button></div><button class="btn o" data-a=closem>Fechar</button>`)};
acts.closem=closeM;
acts.stset=async b=>{const a=AGSEL;try{await setDoc(doc(db,'saloes',OID,'agendamentos',a.id),{status:b.dataset.s},{merge:true});a.status=b.dataset.s;closeM();toast('Atualizado ✔');draw()}catch(e){alert('Erro: '+(e.code||e.message))}};
acts.acancel=async()=>{const a=AGSEL;if(!confirm('Cancelar este agendamento? O horário será liberado.'))return;const w=writeBatch(db);(a.blocos||[]).forEach(id=>w.delete(doc(db,'ocupados',id)));w.delete(doc(db,'saloes',U.uid,'agendamentos',a.id));try{await w.commit();LOADED=false;closeM();toast('Agendamento cancelado');draw()}catch(e){alert('Erro: '+(e.code||e.message))}};

/* ---- Novo agendamento (pelo salão) ---- */
function openNovo(pre={}){
  if(!S.profissionais.length||!S.servicos.length)return alert('Cadastre ao menos um serviço e um profissional antes de agendar.');
  NV={hora:'',pre:pre.hora||'',esp:pre.esp||''};const cl=clientes();
  openM(`<h2>Novo agendamento</h2><label>Cliente</label><input id=mn list=mcl placeholder="Nome (ou escolha um cliente)" value="${esc(pre.nome)}" autocomplete=off><datalist id=mcl>${cl.map(c=>`<option value="${esc(c.nome)}">${esc(c.tel)}</option>`).join('')}</datalist>
  <label>WhatsApp</label><input id=mt type=tel placeholder="(61) 99999-9999" value="${esc(pre.tel)}"><label>Profissional</label><select id=mp><option value="">Selecione</option>${S.profissionais.filter(act).map(p=>`<option value="${p.id}" ${pre.prof==p.id?'selected':''}>${esc(p.nome)}</option>`).join('')}</select>
  <label>Serviço</label><select id=ms></select><label>Data</label><input id=md type=date value="${pre.data||iso(new Date())}"><label>Horário</label><div class=slots id=msl></div><label>Valor</label><input id=mv data-money inputmode=numeric placeholder="R$ 0,00">
  <button class=btn data-a=nvok>Agendar</button><button class="btn o" data-a=closem>Cancelar</button>`);
  nvServ();nvSlots();
}
function nvServ(){const pf=S.profissionais.find(p=>p.id==$('#mp').value),cur=$('#ms').value,L=S.servicos.filter(x=>act(x)&&(!pf||!(pf.servs&&pf.servs.length)||pf.servs.includes(x.id)));
  $('#ms').innerHTML='<option value="">Selecione</option>'+L.map(x=>`<option value="${x.id}" ${cur==x.id?'selected':''}>${esc(x.nome)} — ${brl(price(x,S.promocoes).final)} (${x.min}min)</option>`).join('')}
async function nvSlots(){
  const pf=$('#mp').value,sv=S.servicos.find(x=>x.id==$('#ms').value),d=$('#md').value,box=$('#msl');NV.hora='';
  if(!pf||!sv||!d){box.innerHTML='<p class=mu style="grid-column:1/-1">Escolha profissional, serviço e data.</p>';return}
  box.innerHTML='<p class=mu style="grid-column:1/-1">Carregando…</p>';const out=await freeSlots(U.uid,pf,sv,d);
  if(NV.pre&&out&&out.includes(NV.pre))NV.hora=NV.pre;
  box.innerHTML=out==null?'<p class=mu style="grid-column:1/-1">O salão não atende neste dia.</p>':out.length?out.map(h=>`<button data-a=nvpick data-h=${h} class="${h==NV.hora?'on':''}">${h}</button>`).join(''):'<p class=mu style="grid-column:1/-1">Sem horários livres.</p>';
}
acts.nvpick=b=>{NV.hora=b.dataset.h;NV.pre='';document.querySelectorAll('#msl button').forEach(x=>x.classList.toggle('on',x==b))};
acts.nvok=async()=>{
  const nome=v('mn'),tel=v('mt'),pf=S.profissionais.find(p=>p.id==v('mp')),sv=S.servicos.find(x=>x.id==v('ms')),d=v('md');
  if(nome.length<2||tel.replace(/\D/g,'').length<10)return alert('Informe o nome e o WhatsApp com DDD.');if(!pf||!sv||!NV.hora)return alert('Escolha profissional, serviço e horário.');
  try{await commitAg(U.uid,pf,sv,d,NV.hora,nome,tel,'',parseM(v('mv')),'','salao');LOADED=false;if(NV.esp){try{await setDoc(doc(db,'saloes',OID,'espera',NV.esp),{status:'atendido',oferta:null},{merge:true})}catch(e){}}DAYSEL=d;CAL={y:+d.slice(0,4),m:+d.slice(5,7)-1};closeM();toast('Agendado ✔');if(!['cal','lista'].includes(TAB))TAB='cal';draw()}
  catch(e){alert('Não foi possível agendar (horário ocupado?).')}
};

/* ---- Clientes ---- */
function clientes(){
  const M={},hoje=iso(new Date());
  AGALL.forEach(a=>{const k=(a.tel||'').replace(/\D/g,'');if(!k)return;(M[k]=M[k]||{k,tel:a.tel,ag:[]}).ag.push(a)});
  return Object.values(M).map(m=>{
    m.ag.sort((a,b)=>(a.data+a.hora).localeCompare(b.data+b.hora));
    const ok=m.ag.filter(a=>a.status!='faltou'),ps=ok.filter(a=>a.data<=hoje);
    m.nome=m.ag[m.ag.length-1].nome;m.foto=[...m.ag].reverse().map(a=>a.foto).find(Boolean)||'';m.email=[...m.ag].reverse().map(a=>a.email).find(Boolean)||'';
    m.n=m.ag.length;m.faltas=m.n-ok.length;m.tot=ok.reduce((t,a)=>t+(a.valor||0),0);m.tk=ok.length?m.tot/ok.length:0;
    m.ult=ps.length?ps[ps.length-1].data:'';m.prox=m.ag.find(a=>a.data>=hoje&&!a.status);m.desde=m.ag[0].data;
    const ds=ps.map(a=>new Date(a.data+'T12:00').getTime()),g=[];for(let i=1;i<ds.length;i++)g.push((ds[i]-ds[i-1])/864e5);m.freq=g.length?Math.round(g.reduce((a,b)=>a+b,0)/g.length):0;
    const mode=f=>{const c={};ok.forEach(a=>c[f(a)]=(c[f(a)]||0)+1);const e=Object.entries(c).sort((a,b)=>b[1]-a[1])[0];return e?e[0]:'—'};
    m.fs=mode(a=>a.servico);m.fp=mode(a=>a.profNome);m.dias=m.ult?Math.round((Date.now()-new Date(m.ult+'T12:00'))/864e5):0;
    m.tag=m.n==1?['Novo','n']:(m.ult&&m.dias>45&&!m.prox)?['Inativo','i']:ok.length>=5?['Fiel','f']:['Regular','r'];
    return m}).sort((a,b)=>(b.ult||b.desde).localeCompare(a.ult||a.desde));
}
function cliPage(){CL=clientes();const mes=iso(new Date()).slice(0,7);
  return `<div class=kp style="margin-bottom:14px">${[['Total de clientes',CL.length],['Novos no mês',CL.filter(c=>c.desde.startsWith(mes)).length],['Fiéis (5+ visitas)',CL.filter(c=>c.tag[1]=='f').length],['Inativos (45+ dias)',CL.filter(c=>c.tag[1]=='i').length]].map(k=>`<div><span>${k[0]}</span><b>${k[1]}</b></div>`).join('')}</div>
  <div class=card style="margin-top:0"><input id=qc placeholder="Buscar por nome ou telefone" value="${esc(QC)}"><div id=cl style="margin-top:8px">${cliRows()}</div></div>`}
function cliRows(){const q=QC.toLowerCase(),L=CL.filter(c=>!q||(c.nome+' '+c.tel).toLowerCase().includes(q));
  return L.length?L.map(c=>`<div class=row><span style="display:flex;gap:10px;align-items:center">${avc((NOTAS[c.k]||{}).foto||c.foto,c.nome,40)}<span><b>${esc(c.nome)}</b> <span class="tag tg-${c.tag[1]}">${c.tag[0]}</span><br><span class=mu>${c.n} visita(s) · ${brl(c.tot)} · última: ${c.ult?fd(c.ult):'—'}</span></span></span><button class="btn s o" data-a=cperfil data-k=${c.k}>Ver perfil</button></div>`).join(''):'<p class=mu>Nenhum cliente encontrado. Envie o link do salão ou crie um agendamento.</p>'}
acts.cperfil=async b=>{
  CL=clientes();const m=CL.find(x=>x.k==b.dataset.k);if(!m)return;if(ROLE=='prof')return perfilProf(m);TMP.cfoto=undefined;let nt={};try{nt=(await getDoc(doc(db,'saloes',U.uid,'notas',m.k))).data()||{}}catch(e){}
  openM(`<div style="display:flex;gap:12px;align-items:center"><span id=cfpw>${avc(nt.foto||m.foto,m.nome,64)}</span><div><h2 style="margin:0">${esc(m.nome)}</h2><span class="tag tg-${m.tag[1]}">${m.tag[0]}</span></div></div>
  <p style="margin:12px 0 6px">📱 ${esc(m.tel)}${m.email?`<br>✉️ ${esc(m.email)}`:''}</p><div style="display:flex;flex-wrap:wrap;gap:8px"><a class="btn s" style="text-decoration:none" target=_blank href="${wa(m.tel)}">WhatsApp</a><a class="btn s o" style="text-decoration:none" href="tel:+${(m.k.length<=11?'55':'')+m.k}">Ligar</a><button class="btn s o" data-a=cpnum data-t="${esc(m.tel)}">Copiar número</button></div>
  <div class=kp style="margin:14px 0">${[['Visitas',m.n],['Total gasto',brl(m.tot)],['Ticket médio',brl(m.tk)],['Frequência',m.freq?'a cada '+m.freq+' dias':'—'],['Faltas',m.faltas],['Cliente desde',fd(m.desde)]].map(k=>`<div><span>${k[0]}</span><b style="font-size:1.05rem">${k[1]}</b></div>`).join('')}</div>
  <p class=mu>Serviço favorito: <b>${esc(m.fs)}</b> · Profissional preferido: <b>${esc(m.fp)}</b><br>Última visita: <b>${m.ult?fd(m.ult)+' (há '+m.dias+' dia(s))':'—'}</b> · Próximo: <b>${m.prox?fd(m.prox.data)+' às '+m.prox.hora:'nenhum'}</b></p>
  <label>Foto do cliente (só você vê)</label><input type=file accept="image/*" data-up=cfoto><label>Observações (só você vê)</label><textarea id=nt rows=3 placeholder="Ex.: prefere degradê, alérgico a..., gosta de conversar">${esc(nt.nota)}</textarea><label>Aniversário</label><input id=nb type=date value="${esc(nt.aniv)}">
  <button class=btn data-a=savenota data-k=${m.k}>Salvar observações</button><button class="btn o" data-a=novo2 data-k=${m.k}>Agendar para este cliente</button>
  <h3 style="margin:18px 0 4px">Histórico</h3>${[...m.ag].reverse().map(a=>`<div class=row style="font-size:.85rem"><span><b>${fd(a.data)} ${a.hora}</b> · ${esc(a.servico)} com ${esc(a.profNome)}<br><span class=mu>${brl(a.valor)}</span></span>${stag(a)}</div>`).join('')}<button class="btn o" data-a=closem>Fechar</button>`);
};
acts.cpnum=b=>navigator.clipboard.writeText(b.dataset.t).then(()=>toast('Número copiado ✔'));
acts.savenota=async b=>{const k=b.dataset.k,o={nota:v('nt'),aniv:v('nb'),foto:TMP.cfoto!==undefined?TMP.cfoto:(NOTAS[k]||{}).foto||''};try{await setDoc(doc(db,'saloes',U.uid,'notas',k),o);NOTAS[k]=o;toast('Dados do cliente salvos ✔');draw()}catch(e){alert('Erro ao salvar: '+(e.code||e.message)+'\nPublique as regras novas do Firestore.')}};
acts.novo2=b=>{const m=clientes().find(x=>x.k==b.dataset.k);openNovo({data:DAYSEL,nome:m.nome,tel:m.tel})};

/* ====== PAGAMENTOS / PIX ====== */
let PF='todos',PM=iso(new Date()).slice(0,7);
const pOf=a=>a.pstatus||'pendente';
const mLabel={pix:'PIX',dinheiro:'Dinheiro',debito:'Cartão débito',credito:'Cartão crédito'};
const ptag=a=>{const p=pOf(a);return p=='pago'?`<span class="tag tg-f">Pago${a.pmetodo?' · '+mLabel[a.pmetodo]:''}</span>`:p=='parcial'?`<span class="tag" style="background:#fef3c7;color:#92400e">Parcial · faltam ${brl(Math.max(0,(a.valor||0)-(a.pvalor||0)))}</span>`:p=='aguardando'?'<span class="tag tg-n">Comprovante enviado</span>':'<span class="tag tg-r">Pagamento pendente</span>'};
const tlv=(id,x)=>id+String(x.length).padStart(2,'0')+x;
const asc=(s,n)=>(String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9 ]/g,'').toUpperCase().slice(0,n).trim())||'NA';
function crc16(s){let c=0xFFFF;for(let i=0;i<s.length;i++){c^=s.charCodeAt(i)<<8;for(let j=0;j<8;j++)c=c&0x8000?((c<<1)^0x1021)&0xFFFF:(c<<1)&0xFFFF}return c.toString(16).toUpperCase().padStart(4,'0')}
function pixKey(){const k=(S.pixChave||'').trim(),t=S.pixTipo||'cpf',d=k.replace(/\D/g,'');if(t=='cpf'||t=='cnpj')return d;if(t=='tel')return '+'+(d.startsWith('55')&&d.length>11?d:'55'+d);return k}
function brcode(valor,txid){
  const gui=tlv('00','br.gov.bcb.pix')+tlv('01',pixKey());
  let p=tlv('00','01')+tlv('01','11')+tlv('26',gui)+tlv('52','0000')+tlv('53','986')+(valor>0?tlv('54',(+valor).toFixed(2)):'')+tlv('58','BR')+tlv('59',asc(S.pixNome||S.nome,25))+tlv('60',asc(S.pixCidade||'Brasilia',15))+tlv('62',tlv('05',String(txid||'***').replace(/[^A-Za-z0-9]/g,'').slice(0,25)||'***'));
  p+='6304';return p+crc16(p);
}
let QRL=null;
const loadQR=()=>QRL||(QRL=new Promise((ok,no)=>{if(window.qrcode)return ok();const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';s.onload=ok;s.onerror=()=>{QRL=null;no()};document.head.append(s)}));
async function qrSvg(txt){
  try{await loadQR();const q=window.qrcode(0,'M');q.addData(txt);q.make();const n=q.getModuleCount(),m=2;let p='';
    for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(q.isDark(r,c))p+=`M${c+m},${r+m}h1v1h-1z`;
    return `<svg viewBox="0 0 ${n+2*m} ${n+2*m}" style="width:230px;max-width:100%;background:#fff;border:1px solid #ddd;border-radius:8px" shape-rendering=crispEdges><path d="${p}"/></svg>`}
  catch(e){return '<p class=mu>Não foi possível gerar o QR agora. Use o código copia e cola abaixo.</p>'}
}
async function showPix(box,valor,id,up){
  if(!box)return;box.innerHTML='<p class=mu>Gerando QR code…</p>';
  const code=brcode(valor,id),svg=await qrSvg(code);
  box.innerHTML=`<div class=pixbx style="text-align:center">${svg}<p style="margin:8px 0"><b>${brl(valor)}</b> · ${esc(S.pixNome||S.nome)}</p><textarea readonly rows=3 style="font-size:.72rem" onclick="this.select()">${code}</textarea><button class="btn s" style="margin-top:6px" data-a=cpix data-c="${code}">Copiar PIX copia e cola</button>${up?`<div class=up style="margin-top:14px;text-align:left"><label>Já pagou? Envie o comprovante (foto ou print)</label><input type=file accept="image/*" data-up=comp data-id=${id}></div>`:''}</div>`;
}
acts.cpix=b=>navigator.clipboard.writeText(b.dataset.c).then(()=>toast('Código PIX copiado ✔'));
acts.vcomp=b=>{const a=MY[+b.dataset.i];openM('<h2>Comprovante enviado</h2><img src="'+a.comp+'" style="max-width:100%;border-radius:8px"><button class="btn o" data-a=closem>Fechar</button>')};
acts.cpay=b=>{const a=MY[+b.dataset.i];openM('<h2>Pagamento via PIX</h2><div id=pbx></div><button class="btn o" data-a=closem>Fechar</button>');showPix($('#pbx'),a.valor,a.id,true)};
acts.cobrar=()=>{const a=AGSEL;openM('<h2>Cobrar via PIX</h2><p class=mu>Mostre este QR code ao cliente.</p><div id=pbx></div><button class="btn o" data-a=closem>Fechar</button>');showPix($('#pbx'),a.valor,a.id,false)};
const pagSet=async(o,msg)=>{const a=AGSEL;try{await setDoc(doc(db,'saloes',U.uid,'agendamentos',a.id),o,{merge:true});Object.assign(a,o);closeM();toast(msg);draw()}catch(e){alert('Erro: '+(e.code||e.message))}};
acts.pagar=()=>pagSet({pstatus:'pago',pmetodo:v('pm'),pvalor:parseM(v('pv')),pquando:Date.now()},'Pagamento registrado ✔');
acts.recusar=()=>{if(confirm('Recusar este comprovante?'))pagSet({pstatus:'pendente',comp:''},'Comprovante recusado')};
acts.estornar=()=>{if(confirm('Estornar o pagamento registrado?'))pagSet({pstatus:'pendente',pmetodo:'',pvalor:0,pquando:0},'Pagamento estornado')};
acts.salpix=async()=>{
  S.pixOn=$('#x0').checked;S.pixTipo=v('x1');S.pixChave=v('x2');S.pixNome=v('x3');S.pixCidade=v('x4');
  const d=S.pixChave.replace(/\D/g,''),t=S.pixTipo,ok=!S.pixChave||(t=='cpf'&&d.length==11)||(t=='cnpj'&&d.length==14)||(t=='tel'&&d.length>=10)||(t=='email'&&S.pixChave.includes('@'))||(t=='rand'&&S.pixChave.length>=30);
  if(!ok)return alert('A chave não confere com o tipo escolhido. Confira e tente de novo.');
  if(S.pixOn&&!S.pixChave)return alert('Informe a chave PIX para aceitar pagamentos por PIX.');
  await save();toast('PIX salvo ✔');draw();
};
acts.pf=b=>{PF=b.dataset.f;draw()};
acts.csv=()=>{const q=x=>'"'+String(x==null?'':x).replace(/"/g,'""')+'"',n=x=>(+x||0).toFixed(2).replace('.',',');
  const rows=[['Data','Hora','Cliente','Telefone','Serviço','Profissional','Valor','Forma escolhida','Situação','Método','Valor pago','Pago em']].concat(pagList().map(a=>[fd(a.data),a.hora,a.nome,a.tel,a.servico,a.profNome,n(a.valor),a.forma=='pix'?'PIX':'No salão',{pago:'Pago',aguardando:'Comprovante enviado',pendente:'Pendente'}[pOf(a)],mLabel[a.pmetodo]||'',a.pvalor?n(a.pvalor):'',a.pquando?new Date(a.pquando).toLocaleString('pt-BR'):'']));
  const l=document.createElement('a');l.href=URL.createObjectURL(new Blob(['\ufeff'+rows.map(r=>r.map(q).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'}));l.download='pagamentos-'+PM+'.csv';l.click()};

/* ====== PAINEL PROFISSIONAL + acessos + desempenho ====== */
const MENUP=[{k:'pdash',t:'Meu painel de controle',i:'📦'},{k:'cal',t:'Meu calendário',i:'📅'},{k:'lista',t:'Agendamentos',i:'📖'},{k:'cli',t:'Meus clientes',i:'👥'},{k:'pgan',t:'Meus ganhos',i:'💰'},{k:'pcfg',t:'Minhas configurações',i:'⚙️'}];
let BUSYP=new Set();
const accOf=id=>(ACC.find(a=>a.profId==id)||{}).email||'';
async function setAcesso(profId,email){const w=writeBatch(db);ACC.filter(a=>a.profId==profId&&a.email!=email).forEach(a=>w.delete(doc(db,'saloes',OID,'acessos',a.email)));if(email)w.set(doc(db,'saloes',OID,'acessos',email),{profId});await w.commit();ACC=ACC.filter(a=>a.profId!=profId&&a.email!=email);if(email)ACC.push({email,profId})}
const saveAg=async p=>{await setDoc(doc(db,'saloes',OID,'agendas',p.id),{hor:p.hor||null,folgas:p.folgas||[]})};
async function loadBusyP(){const q=await getDocs(query(collection(db,'ocupados'),where('uid','==',OID),where('prof','==',ME))),bs=new Set();q.docs.forEach(x=>busyAdd(bs,x.data()));BUSYP=bs}
function desemp(L){
  const now=new Date(),ym=iso(now).slice(0,7),pm=iso(new Date(now.getFullYear(),now.getMonth()-1,1)).slice(0,7),ok=a=>a.status!='faltou';
  const cur=L.filter(a=>a.data.startsWith(ym)&&ok(a)),prv=L.filter(a=>a.data.startsWith(pm)&&ok(a)),rc=cur.reduce((t,a)=>t+(a.valor||0),0),rp=prv.reduce((t,a)=>t+(a.valor||0),0);
  const pc=(a,b)=>b?Math.round((a-b)/b*100):(a?100:0),bd=p=>`<span class="bdg ${p<0?'neg':''}">${Math.abs(p)}% ${p<0?'▼':'▲'}</span>`;
  const dim=new Date(now.getFullYear(),now.getMonth()+1,0).getDate(),ser=[...Array(dim)].map((_,i)=>cur.filter(a=>+a.data.slice(8)==i+1).length),mx=Math.max(1,...ser);
  const line=ser.map((v,i)=>(i?'L':'M')+(i/(dim-1)*300).toFixed(1)+','+(92-v/mx*80).toFixed(1)).join(' ');
  return `<div class=card><h2>Desempenho <span class=mu style="font-size:.8rem;font-weight:400">· ${MES[now.getMonth()]}</span></h2><div class=perf><div>${bd(pc(cur.length,prv.length))}<b>${cur.length}</b><span>Agendamentos</span></div><div>${bd(pc(rc,rp))}<b>${brl(rc)}</b><span>Receita de vendas</span></div></div><svg viewBox="0 0 300 100" preserveAspectRatio="none" style="width:100%;height:110px;margin-top:8px"><path d="${line} L300,95 L0,95 Z" fill="var(--c)" opacity=".12"/><path d="${line}" fill="none" stroke="var(--c)" stroke-width="2.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg></div>`;
}
function disp(){
  const now=new Date(),sv={min:S.passo||30};let h='',lm=-1;
  for(let i=0;i<14;i++){const dt=new Date(now.getFullYear(),now.getMonth(),now.getDate()+i),d=iso(dt),L=slotsInfo(ME,sv,d,BUSYP);
    if(dt.getMonth()!=lm){lm=dt.getMonth();h+=`<div class=dmo>${MES[lm]}</div>`}
    h+=`<div class=drow><span class=dl><b>${dt.getDate()}</b> ${WK[(dt.getDay()+6)%7]}</span><span class=blks>${L.length?L.map(x=>`<i class="${x.ok?'on':''}" title="${x.h}"></i>`).join(''):'<em class=mu>folga</em>'}</span></div>`}
  return `<div class=card><h2>Disponibilidade</h2><p class=mu>Azul = horário livre para agendamento.</p>${h}</div>`;
}
function pdash(){
  const hoje=iso(new Date()),dH=AGALL.filter(a=>a.data==hoje&&a.status!='faltou').sort((a,b)=>a.hora.localeCompare(b.hora));
  return desemp(AGALL).replace('<div class=card>','<div class=card style="margin-top:0">')+`<div class=card><h2>Agenda de hoje</h2>${dH.map(a=>`<div class=row style="cursor:pointer" data-a=agd data-id=${a.id}><span><b>${a.hora}</b> · ${esc(a.nome)}<br><span class=mu>${esc(a.servico)}</span></span>${stag(a)}</div>`).join('')||'<p class=mu>Nenhum agendamento hoje.</p>'}</div>`+disp();
}
function ganPage(){
  const [f0,f1,lb]=frange(),hoje=iso(new Date()),real=a=>a.status!='faltou'&&(a.data<=hoje||a.status=='concluido');
  const L=AGALL.filter(a=>a.data>=f0&&a.data<=f1&&a.status!='faltou').sort((a,b)=>(b.data+b.hora).localeCompare(a.data+a.hora)),R=L.filter(real),fat=R.reduce((t,a)=>t+(a.valor||0),0),dev=+(fat*MYPCT/100).toFixed(2),pg=COMP[`${ME}_${FP}_${f0}`];
  return `<div class=card style="margin-top:0"><div class=tabs>${perTabs(FP,'fp')}</div>${perNav('fnav',lb)}<div style="text-align:center;margin-top:6px"><button class="btn s o" data-a=fhoje>Hoje</button></div></div>
  <div class=kp>${[['Atendimentos realizados',R.length],['Faturado nos meus atendimentos',brl(fat)],['Minha comissão'+(MYPCT?' ('+MYPCT+'%)':''),MYPCT?brl(dev):'—'],['Situação da comissão',pg?'Paga em '+new Date(pg.quando).toLocaleDateString('pt-BR'):MYPCT&&dev>0?'A receber':'—']].map(k=>`<div><span>${k[0]}</span><b style="font-size:1.1rem">${k[1]}</b></div>`).join('')}</div>
  ${MYPCT?'':'<p class=mu style="margin:8px 4px">O salão ainda não informou sua % de comissão.</p>'}
  <div class=card><h2>Meus atendimentos no período</h2>${L.map(a=>`<div class=row style="cursor:pointer" data-a=agd data-id=${a.id}><span><b>${fd(a.data)} ${a.hora}</b> · ${esc(a.nome)}<br><span class=mu>${esc(a.servico)} · ${brl(a.valor)}</span></span><span style="text-align:right">${stag(a)}<br>${ptag(a)}</span></div>`).join('')||'<p class=mu>Nenhum atendimento no período.</p>'}</div>`;
}
function pcfg(){
  const i=S.profissionais.findIndex(x=>x.id==ME),p=S.profissionais[i];if(!p)return '<div class=card>Profissional não encontrado.</div>';
  return `<div class=card style="margin-top:0"><h2>Minha agenda</h2><p class=mu>Defina seus dias, horários e folgas. As mudanças valem na hora para quem for agendar com você.</p>${profHor(p,i)}</div>`;
}
function agdProf(a){AGSEL=a;const k=(a.tel||'').replace(/\D/g,'');
  openM(`<h2>${esc(a.servico)}</h2><p><b>${fd(a.data)} às ${a.hora}</b> ${stag(a)}</p><p style="margin-top:8px">${esc(a.nome)} · ${esc(a.tel)}${a.obs?`<br>💬 ${esc(a.obs)}`:''}<br>Valor: <b>${brl(a.valor)}</b> ${ptag(a)}</p>
  <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:14px"><button class="btn s" data-a=stset data-s=concluido>✔ Concluído</button><button class="btn s o" data-a=stset data-s=faltou>Faltou</button>${a.status?'<button class="btn s o" data-a=stset data-s="">Reabrir</button>':''}<a class="btn s o" style="text-decoration:none" target=_blank href="${wa(a.tel)}">WhatsApp</a><button class="btn s o" data-a=cperfil data-k=${k}>Ver cliente</button></div><button class="btn o" data-a=closem>Fechar</button>`)}
function perfilProf(m){
  openM(`<div style="display:flex;gap:12px;align-items:center">${avc(m.foto,m.nome,64)}<div><h2 style="margin:0">${esc(m.nome)}</h2><span class="tag tg-${m.tag[1]}">${m.tag[0]}</span></div></div>
  <p style="margin:12px 0 6px">📱 ${esc(m.tel)}</p><a class="btn s" style="text-decoration:none" target=_blank href="${wa(m.tel)}">WhatsApp</a>
  <div class=kp style="margin:14px 0">${[['Visitas',m.n],['Total gasto',brl(m.tot)],['Ticket médio',brl(m.tk)]].map(k=>`<div><span>${k[0]}</span><b style="font-size:1.05rem">${k[1]}</b></div>`).join('')}</div>
  <h3 style="margin:10px 0 4px">Histórico</h3>${[...m.ag].reverse().map(a=>`<div class=row style="font-size:.85rem"><span><b>${fd(a.data)} ${a.hora}</b> · ${esc(a.servico)}<br><span class=mu>${brl(a.valor)}</span></span>${stag(a)}</div>`).join('')}<button class="btn o" data-a=closem>Fechar</button>`);
}
const profLink=()=>BASE+'profissional.html?s='+S.slug;
function profAcessoCard(){
  const L=S.profissionais.filter(p=>accOf(p.id));
  return `<div class=card style="margin-top:0"><h2>Acesso dos profissionais</h2><p class=mu>Cada profissional entra num painel próprio para informar a agenda e acompanhar agendamentos, clientes e ganhos.</p>
  <div class=quick style="display:block"><b>🔑 Link de acesso dos profissionais</b><input readonly value="${profLink()}" onclick="this.select()" style="margin:8px 0"><div class=aca><button class="btn s" data-a=copyp>Copiar link</button></div>
  <p class=mu style="margin:8px 0 0">1) Cadastre o e-mail do profissional no formulário abaixo (campo "E-mail de acesso"). 2) Envie este link a ele. 3) Ele toca em <b>Primeiro acesso (criar senha)</b>, usa o mesmo e-mail e confirma o e-mail que o sistema envia. 4) Depois é só entrar.</p></div>
  ${L.map(p=>{const em=accOf(p.id),msg='Olá '+p.nome+'! Você foi cadastrado(a) no '+S.nome+'. Acesse '+profLink()+' , toque em "Primeiro acesso (criar senha)" e use este e-mail: '+em+'. Depois confirme o e-mail que o sistema enviar.';return `<div class=row><span><b>${esc(p.nome)}</b><br><span class=mu>🔑 ${esc(em)}</span></span><a class="btn s o" style="text-decoration:none" href="mailto:${esc(em)}?subject=${encodeURIComponent('Seu acesso ao painel do '+S.nome)}&body=${encodeURIComponent(msg)}">✉ Enviar convite</a></div>`}).join('')}</div>`;
}
acts.copyp=()=>navigator.clipboard.writeText(profLink()).then(()=>toast('Link do profissional copiado ✔'));
acts.addcup=async()=>{const cd=v('a1').toUpperCase().replace(/\s/g,''),pc=+v('a2');if(!cd||!(pc>0&&pc<=90))return alert('Informe o código e um desconto entre 1 e 90%.');put('cupons',{codigo:cd,pct:pc});await save();toast('Salvo ✔');draw()};
acts.addloc=async()=>{if(!v('a1'))return alert('Informe o nome da unidade.');put('locais',{nome:v('a1'),end:v('a2')});await save();toast('Salvo ✔');draw()};
acts.salph=async b=>{const i=+b.dataset.i,p=S.profissionais[i];
  if(document.querySelector('.pcustom[data-i="'+i+'"]').checked){const dias=[...document.querySelectorAll('.pdia'+i+':checked')].map(x=>+x.value),al=v('ph'+i+'c'),af=v('ph'+i+'d');p.hor={abre:v('ph'+i+'a'),fecha:v('ph'+i+'b'),almI:al&&af?al:'',almF:al&&af?af:'',dias}}else p.hor=undefined;
  try{await saveAg(p);toast('Agenda de '+p.nome+' salva ✔');draw()}catch(e){alert('Erro ao salvar: '+(e.code||e.message)+'\nPublique as regras novas do Firestore.')}};
acts.fadd=async b=>{const i=+b.dataset.i,p=S.profissionais[i],d=v('fd'+i);if(!d)return alert('Escolha a data.');p.folgas=[...new Set([...(p.folgas||[]),d])];try{await saveAg(p);toast('Dia bloqueado ✔');draw()}catch(e){alert('Erro: '+(e.code||e.message))}};
acts.fdel=async b=>{const p=S.profissionais[+b.dataset.i];p.folgas=(p.folgas||[]).filter(x=>x!=b.dataset.d);try{await saveAg(p);draw()}catch(e){alert('Erro: '+(e.code||e.message))}};

/* ====== PAGAMENTO PARCIAL, FINANCEIRO, LISTA DE ESPERA (salão), ESTILOS ====== */
const pgsOf=a=>a.pgs||(a.pvalor?[{valor:a.pvalor,metodo:a.pmetodo||'pix',quando:a.pquando||new Date(a.data+'T12:00').getTime()}]:[]);
const recStatus=(a,tot)=>tot>=a.valor-0.005&&tot>0?'pago':tot>0?'parcial':(a.comp?'aguardando':'pendente');
function payBlock(a){
  const ps=pOf(a),rc=a.pvalor||0,rest=Math.max(0,+(a.valor-rc).toFixed(2)),pg=pgsOf(a);
  return `<div style="background:var(--bg);border-radius:10px;padding:12px;margin-top:12px"><b>💳 Pagamento</b> ${ptag(a)}<br><span class=mu>O cliente escolheu: ${a.forma=='pix'?'PIX':'pagar no salão'}</span>
  <p style="margin:8px 0 4px">Serviço <b>${brl(a.valor)}</b> · Recebido <b>${brl(rc)}</b> · ${rest>0?`<span style="color:#b45309">Restante <b>${brl(rest)}</b></span>`:'<span style="color:#16a34a">Quitado ✔</span>'}</p>
  ${pg.map((x,i)=>`<div class=row style="font-size:.82rem;padding:5px 0"><span>${new Date(x.quando||0).toLocaleDateString('pt-BR')} · ${mLabel[x.metodo]||x.metodo} · <b>${brl(x.valor)}</b></span><button class=x data-a=pgdel data-i=${i} title="Estornar este pagamento">✕</button></div>`).join('')}
  ${a.comp?`<p style="margin:8px 0 4px">Comprovante enviado (toque para ampliar):</p><a href="${a.comp}" target=_blank><img src="${a.comp}" style="max-width:100%;max-height:240px;border-radius:8px;border:1px solid #ddd"></a>`:''}
  ${rest>0?`<p class=mu style="margin:10px 0 4px">${a.comp?'Confira o comprovante e informe o valor recebido. Pagamento parcial? Altere o valor.':'Registrar pagamento recebido (pode ser parcial).'}</p><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><select id=pm style="width:auto"><option value=pix ${a.forma=='pix'||a.comp?'selected':''}>PIX</option><option value=dinheiro ${a.forma!='pix'&&!a.comp?'selected':''}>Dinheiro</option><option value=debito>Cartão débito</option><option value=credito>Cartão crédito</option></select><input id=pv data-money inputmode=numeric value="${fmtM(rest)}" style="width:130px"><button class="btn s" data-a=pagar>${a.comp?'Confirmar pagamento':'Registrar pagamento'}</button></div>
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">${a.comp?'<button class="btn s o" data-a=recusar>Recusar comprovante</button>':''}${S.pixOn&&S.pixChave?'<button class="btn s o" data-a=cobrar>Cobrar restante via PIX (QR)</button>':''}</div>`:''}</div>`;
}
acts.pagar=async()=>{const a=AGSEL,rest=+(a.valor-(a.pvalor||0)).toFixed(2),v0=parseM(v('pv'));
  if(!(v0>0))return alert('Informe o valor recebido.');if(v0>rest+0.005&&!confirm('O valor é maior que o restante ('+brl(rest)+'). Registrar mesmo assim?'))return;
  const pgs=[...pgsOf(a),{valor:v0,metodo:v('pm'),quando:Date.now()}],tot=+pgs.reduce((t,x)=>t+x.valor,0).toFixed(2);
  await pagSet({pgs,pvalor:tot,pstatus:tot>=a.valor-0.005?'pago':'parcial',pmetodo:v('pm'),pquando:Date.now()},tot>=a.valor-0.005?'Pagamento quitado ✔':'Pagamento parcial registrado ✔')};
acts.pgdel=async b=>{if(!confirm('Estornar este pagamento?'))return;const a=AGSEL,pgs=pgsOf(a).filter((_,k)=>k!=+b.dataset.i),tot=+pgs.reduce((t,x)=>t+x.valor,0).toFixed(2);
  await pagSet({pgs,pvalor:tot,pstatus:recStatus(a,tot)},'Pagamento estornado')};
acts.recusar=()=>{if(confirm('Recusar este comprovante?'))pagSet({pstatus:(AGSEL.pvalor||0)>0?'parcial':'pendente',comp:''},'Comprovante recusado')};
acts.cobrar=()=>{const a=AGSEL;openM('<h2>Cobrar via PIX</h2><p class=mu>Valor restante: <b>'+brl(Math.max(0,a.valor-(a.pvalor||0)))+'</b>. Mostre este QR code ao cliente.</p><div id=pbx></div><button class="btn o" data-a=closem>Fechar</button>');showPix($('#pbx'),Math.max(0,a.valor-(a.pvalor||0)),a.id,false)};
/* ---- listas de pagamentos com parcial ---- */
let PP='mes',PR=iso(new Date());
function rangeOf(k,ref){const d=new Date(ref+'T12:00'),p=n=>String(n).padStart(2,'0');
  if(k=='dia')return[ref,ref,fd(ref)+' · '+DIAS[d.getDay()]];
  if(k=='sem'){const a=new Date(d);a.setDate(d.getDate()-((d.getDay()+6)%7));const b=new Date(a);b.setDate(a.getDate()+6);return[iso(a),iso(b),'Semana de '+fd(iso(a))+' a '+fd(iso(b))]}
  if(k=='ano'){const y=d.getFullYear();return[y+'-01-01',y+'-12-31','Ano '+y]}
  const y=d.getFullYear(),m=d.getMonth(),last=new Date(y,m+1,0).getDate();return[`${y}-${p(m+1)}-01`,`${y}-${p(m+1)}-${p(last)}`,MES[m]+' '+y]}
const shiftRef=(k,ref,n)=>{const d=new Date(ref+'T12:00');if(k=='dia')d.setDate(d.getDate()+n);else if(k=='sem')d.setDate(d.getDate()+7*n);else if(k=='mes')d.setMonth(d.getMonth()+n,1);else d.setFullYear(d.getFullYear()+n,0,1);return iso(d)};
const perTabs=(cur,ac)=>[['dia','Dia'],['sem','Semana'],['mes','Mês'],['ano','Ano']].map(x=>`<button class="${cur==x[0]?'on':''}" data-a=${ac} data-f=${x[0]}>${x[1]}</button>`).join('');
const perNav=(ac,lb)=>`<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin:12px 0 4px"><button class="btn s o" data-a=${ac} data-n=-1>‹</button><b style="text-align:center">${lb}</b><button class="btn s o" data-a=${ac} data-n=1>›</button></div>`;
function pagList(){const [f0,f1]=rangeOf(PP,PR);
  return AGALL.filter(a=>a.data>=f0&&a.data<=f1&&a.status!='faltou'&&(PF=='todos'||(PF=='conf'&&pOf(a)=='aguardando')||(PF=='parc'&&pOf(a)=='parcial')||(PF=='pend'&&pOf(a)!='pago')||(PF=='pago'&&pOf(a)=='pago'))).sort((a,b)=>(b.data+b.hora).localeCompare(a.data+a.hora));
}
function pagPage(){
  const [f0,f1,lb]=rangeOf(PP,PR),base=AGALL.filter(a=>a.data>=f0&&a.data<=f1&&a.status!='faltou'),by={};
  base.forEach(a=>pgsOf(a).forEach(x=>by[x.metodo]=(by[x.metodo]||0)+x.valor));
  const rec=base.reduce((t,a)=>t+(a.pvalor||0),0),aber=base.reduce((t,a)=>t+Math.max(0,(a.valor||0)-(a.pvalor||0)),0),conf=AGALL.filter(a=>a.pstatus=='aguardando').length,parc=base.filter(a=>pOf(a)=='parcial').length;
  return `<div class=card style="margin-top:0"><div class=tabs>${perTabs(PP,'pp')}</div>${perNav('pnav',lb)}<div style="text-align:center;margin-top:6px"><button class="btn s o" data-a=phoje>Hoje</button></div></div>
  <div class=kp>${[['Recebido no período',brl(rec)],['A receber no período',brl(aber)],['Comprovantes a conferir',conf],['Pagamentos parciais',parc],...Object.keys(mLabel).map(k=>[mLabel[k],brl(by[k]||0)])].map(k=>`<div><span>${k[0]}</span><b>${k[1]}</b></div>`).join('')}</div>
  <div class=card><div class=tabs>${[['todos','Todos'],['conf','A conferir'],['parc','Parciais'],['pend','Pendentes'],['pago','Pagos']].map(x=>`<button class="${PF==x[0]?'on':''}" data-a=pf data-f=${x[0]}>${x[1]}</button>`).join('')}</div>
  <div style="margin:10px 0"><button class="btn s o" data-a=csv>Exportar CSV</button></div>
  ${pagList().map(a=>`<div class=row style="cursor:pointer" data-a=agd data-id=${a.id}><span><b>${fd(a.data)} ${a.hora}</b> · ${esc(a.nome)}<br><span class=mu>${esc(a.servico)} · ${brl(a.valor)}${(a.pvalor||0)>0&&pOf(a)!='pago'?' · recebido '+brl(a.pvalor):''} · ${a.forma=='pix'?'PIX':'No salão'} ${a.comp?'📎':''}</span></span>${ptag(a)}</div>`).join('')||'<p class=mu>Nenhum registro neste período/filtro.</p>'}</div>`;
}
acts.pp=b=>{PP=b.dataset.f;draw()};acts.pnav=b=>{PR=shiftRef(PP,PR,+b.dataset.n);draw()};acts.phoje=()=>{PR=iso(new Date());draw()};
acts.csv=()=>{const q=x=>'"'+String(x==null?'':x).replace(/"/g,'""')+'"',n=x=>(+x||0).toFixed(2).replace('.',',');
  const rows=[['Data','Hora','Cliente','Telefone','Serviço','Profissional','Valor','Forma escolhida','Situação','Recebido','Restante','Pagamentos']].concat(pagList().map(a=>[fd(a.data),a.hora,a.nome,a.tel,a.servico,a.profNome,n(a.valor),a.forma=='pix'?'PIX':'No salão',{pago:'Pago',parcial:'Parcial',aguardando:'Comprovante enviado',pendente:'Pendente'}[pOf(a)],n(a.pvalor),n(Math.max(0,a.valor-(a.pvalor||0))),pgsOf(a).map(x=>(mLabel[x.metodo]||x.metodo)+' '+n(x.valor)).join(' + ')]));
  const l=document.createElement('a');l.href=URL.createObjectURL(new Blob(['\ufeff'+rows.map(r=>r.map(q).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'}));l.download='pagamentos-'+PP+'-'+rangeOf(PP,PR)[0]+'.csv';l.click()};
/* ---- resumo financeiro + comissões ---- */
let FP='mes',FR=iso(new Date()),COMP={},PRIV={map:{}};
function frange(){return rangeOf(FP,FR)}
function finPage(){
  const [f0,f1,lb]=frange(),hoje=iso(new Date()),real=a=>a.status!='faltou'&&(a.data<=hoje||a.status=='concluido');
  const L=AGALL.filter(a=>a.data>=f0&&a.data<=f1&&a.status!='faltou'),R=L.filter(real),fat=R.reduce((t,a)=>t+(a.valor||0),0);
  const pay=[];AGALL.forEach(a=>pgsOf(a).forEach(x=>{const dd=iso(new Date(x.quando||0));if(dd>=f0&&dd<=f1)pay.push({...x,a})}));
  const rec=pay.reduce((t,x)=>t+x.valor,0),aber=L.reduce((t,a)=>t+Math.max(0,(a.valor||0)-(a.pvalor||0)),0),by={};pay.forEach(x=>by[x.metodo]=(by[x.metodo]||0)+x.valor);
  const grp=FP=='ano',kf=d=>grp?d.slice(0,7):d,days=[];if(grp){for(let m=1;m<=12;m++)days.push(f0.slice(0,4)+'-'+String(m).padStart(2,'0'))}else for(let d=new Date(f0+'T12:00');iso(d)<=f1;d.setDate(d.getDate()+1))days.push(iso(d));
  const ser=days.map(d=>({d,f:R.filter(a=>kf(a.data)==d).reduce((t,a)=>t+(a.valor||0),0),r:pay.filter(x=>kf(iso(new Date(x.quando||0)))==d).reduce((t,x)=>t+x.valor,0)})),mx=Math.max(1,...ser.map(x=>Math.max(x.f,x.r)));
  const svc={};R.forEach(a=>{svc[a.servico]=svc[a.servico]||{n:0,v:0};svc[a.servico].n++;svc[a.servico].v+=a.valor||0});
  const topS=Object.entries(svc).sort((a,b)=>b[1].v-a[1].v).slice(0,5);
  let totC=0;
  const prow=S.profissionais.map(p=>{const mine=R.filter(a=>a.prof==p.id),f=mine.reduce((t,a)=>t+(a.valor||0),0),pct=+((PRIV.map||{})[p.id]||0),dev=+(f*pct/100).toFixed(2),key=`${p.id}_${FP}_${f0}`,pg=COMP[key];totC+=pg?0:dev;
    return `<div class=row style="align-items:flex-start"><span><b>${esc(p.nome)}</b><br><span class=mu>${mine.length} atendimento(s) · faturado ${brl(f)} · comissão ${pct}% = <b>${brl(dev)}</b></span></span><span style="text-align:right">${pg?`<span class="tag tg-f">Paga em ${new Date(pg.quando).toLocaleDateString('pt-BR')}</span><br><button class="btn s o" style="margin-top:4px" data-a=compdel data-k=${key}>Estornar</button>`:dev>0?`<button class="btn s" data-a=compay data-p=${p.id}>Registrar pagamento</button>`:'<span class=mu>—</span>'}</span></div>`}).join('');
  return `<div class=card style="margin-top:0"><div class=tabs>${perTabs(FP,'fp')}</div>
  <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:12px"><button class="btn s o" data-a=fnav data-n=-1>‹</button><b style="text-align:center">${lb}</b><button class="btn s o" data-a=fnav data-n=1>›</button></div><div style="text-align:center;margin-top:8px"><button class="btn s o" data-a=fhoje>Hoje</button></div></div>
  <div class=kp>${[['Faturado (serviços realizados)',brl(fat)],['Recebido no período',brl(rec)],['A receber',brl(aber)],['Atendimentos',R.length],['Ticket médio',brl(R.length?fat/R.length:0)],['Comissões a pagar',brl(totC)]].map(k=>`<div><span>${k[0]}</span><b>${k[1]}</b></div>`).join('')}</div>
  <div class=g2><div class=card><h2>Faturamento por dia</h2><div class=fbars>${ser.map(x=>`<div title="${grp?MES[+x.d.slice(5)-1]:fd(x.d)}: faturado ${brl(x.f)} · recebido ${brl(x.r)}"><i class=f style="height:${Math.max(2,x.f/mx*100)}%"></i><i class=r style="height:${Math.max(2,x.r/mx*100)}%"></i></div>`).join('')}</div><div class=fbl>${ser.map(x=>`<span>${grp?MES[+x.d.slice(5)-1].slice(0,3):x.d.slice(8)}</span>`).join('')}</div><p class=mu style="margin-top:6px"><span style="color:var(--c)">■</span> faturado · <span style="color:#22c55e">■</span> recebido</p></div>
  <div class=card><h2>Recebido por forma</h2>${Object.keys(mLabel).map(k=>`<div class=row><span>${mLabel[k]}</span><b>${brl(by[k]||0)}</b></div>`).join('')}</div>
  <div class=card style="grid-column:1/-1"><h2>Comissões dos profissionais</h2><p class=mu>Cálculo: % de comissão de cada profissional × valor faturado dos atendimentos realizados no período. Defina a % em Cadastros › Profissionais.</p>${prow||'<p class=mu>Cadastre profissionais.</p>'}</div>
  <div class=card style="grid-column:1/-1"><h2>Serviços que mais faturaram</h2>${topS.map(x=>`<div class=row><span>${esc(x[0])} <span class=mu>· ${x[1].n}x</span></span><b>${brl(x[1].v)}</b></div>`).join('')||'<p class=mu>Sem dados.</p>'}</div></div>`;
}
acts.fp=b=>{FP=b.dataset.f;draw()};acts.fhoje=()=>{FR=iso(new Date());draw()};
acts.fnav=b=>{FR=shiftRef(FP,FR,+b.dataset.n);draw()};
acts.compay=async b=>{const [f0,f1]=frange(),hoje=iso(new Date()),pid=b.dataset.p,p=S.profissionais.find(x=>x.id==pid),pct=+((PRIV.map||{})[pid]||0),f=AGALL.filter(a=>a.prof==pid&&a.data>=f0&&a.data<=f1&&a.status!='faltou'&&(a.data<=hoje||a.status=='concluido')).reduce((t,a)=>t+(a.valor||0),0),dev=+(f*pct/100).toFixed(2),key=`${pid}_${FP}_${f0}`;
  if(!confirm('Registrar o pagamento de '+brl(dev)+' de comissão para '+p.nome+'?'))return;
  const o={profId:pid,periodo:FP,inicio:f0,fim:f1,valor:dev,pct,quando:Date.now()};try{await setDoc(doc(db,'saloes',OID,'comissoes',key),o);COMP[key]=o;toast('Comissão registrada ✔');draw()}catch(e){alert('Erro: '+(e.code||e.message)+'\nPublique as regras novas do Firestore.')}};
acts.compdel=async b=>{if(!confirm('Estornar o registro desta comissão?'))return;const w=writeBatch(db);w.delete(doc(db,'saloes',OID,'comissoes',b.dataset.k));try{await w.commit();delete COMP[b.dataset.k];draw()}catch(e){alert('Erro: '+(e.code||e.message))}};
async function setComissao(pid,pct){PRIV.map={...(PRIV.map||{}),[pid]:pct};await setDoc(doc(db,'saloes',OID,'comissaoPct',pid),{pct})}
/* ---- lista de espera (salão) ---- */
let ESP=[],ESPSL={},ESPUN=null,ESPFIRST=true;
function listenEsp(){if(ESPUN)ESPUN();ESPFIRST=true;
  ESPUN=onSnapshot(collection(db,'saloes',OID,'espera'),snap=>{ESP=snap.docs.map(d=>({id:d.id,...d.data()}));
    if(!ESPFIRST)snap.docChanges().forEach(c=>{if(c.type=='added')notify('Encaixe/lista de espera: '+c.doc.data().nome+' quer horário em '+fd(c.doc.data().data),'esp')});
    ESPFIRST=false;if(TAB=='esp'&&!$('#mo')&&!/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||''))draw()},e=>console.log('espera',e.code))}
async function loadEspSlots(){ESPSL={};const hoje=iso(new Date());
  for(const e of ESP.filter(x=>(x.status=='aguardando'||x.status=='ofertado')&&x.data>=hoje)){
    const sv=S.servicos.find(x=>x.id==e.servId)||{min:e.min||30},ps=e.prof?[e.prof]:S.profissionais.filter(p=>act(p)&&(!(p.servs&&p.servs.length)||p.servs.includes(e.servId))).map(p=>p.id),out=[];
    for(const pid of ps){try{const L=await freeSlots(OID,pid,sv,e.data);(L||[]).forEach(h=>out.push({prof:pid,profNome:(S.profissionais.find(p=>p.id==pid)||{}).nome||'',h}))}catch(x){}}
    out.sort((a,b)=>a.h.localeCompare(b.h));ESPSL[e.id]=out}}
function espPage(){
  const hoje=iso(new Date()),L=ESP.filter(e=>e.status!='atendido'&&e.status!='cancelado'&&e.data>=hoje).sort((a,b)=>a.data.localeCompare(b.data)||(a.criado||0)-(b.criado||0));
  return `<div class=card style="margin-top:0"><h2>Encaixe / lista de espera</h2><p class=mu>Clientes que querem ser avisados se abrir horário no dia pedido. Quando um horário fica livre (cancelamento ou remarcação), ele aparece aqui. Ofereça ao cliente: ele recebe o aviso no app (se tiver conta) e no WhatsApp, e você também pode agendar direto.</p></div>`+
  (L.map(e=>{const sl=(ESPSL[e.id]||[]).slice(0,10);return `<div class=card><div class=row style="border:0;padding:0"><span><b>${esc(e.nome)}</b> <span class="tag ${e.status=='ofertado'?'tg-f':'tg-r'}">${e.status=='ofertado'?'Oferta enviada':'Aguardando'}</span><br><span class=mu>${esc(e.servico||'')} · ${e.profNome?esc(e.profNome):'qualquer profissional'} · <b>${fd(e.data)} · ${DIAS[wdOf(e.data)]}</b>${e.obs?' · 💬 '+esc(e.obs):''}</span></span><a class="btn s o" style="text-decoration:none" target=_blank href="${wa(e.tel)}">WhatsApp</a></div>
    ${e.status=='ofertado'&&e.oferta?`<p class=mu style="margin-top:6px">Oferta: ${fd(e.oferta.data)} às ${e.oferta.hora} com ${esc(e.oferta.profNome)} — aguardando resposta.</p>`:''}
    <p style="margin:10px 0 4px"><b>${sl.length?'✅ Horários livres neste dia agora:':'Sem horários livres neste dia ainda.'}</b></p><div class=aca>${sl.map(x=>`<button class="btn s o" data-a=wloffer data-id=${e.id} data-h=${x.h} data-p=${x.prof}>${x.h} · ${esc(x.profNome)}</button>`).join('')}</div>
    <div class=aca style="margin-top:10px"><button class="btn s" data-a=wlbook data-id=${e.id}>Agendar agora</button><button class="btn s o" data-a=wldone data-id=${e.id}>Marcar atendido</button><button class="btn s o" style="color:#c33;border-color:#c33" data-a=wlrm data-id=${e.id}>Remover</button></div></div>`}).join('')||'<div class=card><p class=mu>Ninguém na lista de espera.</p></div>');
}
acts.wloffer=async b=>{const e=ESP.find(x=>x.id==b.dataset.id),p=S.profissionais.find(x=>x.id==b.dataset.p),o={prof:p.id,profNome:p.nome,hora:b.dataset.h,data:e.data};
  try{await setDoc(doc(db,'saloes',OID,'espera',e.id),{status:'ofertado',oferta:o},{merge:true});e.status='ofertado';e.oferta=o;
    window.open(wa(e.tel,'Olá '+e.nome+'! Abriu um horário para '+(e.servico||'seu serviço')+' no '+S.nome+': '+fd(e.data)+' às '+o.hora+' com '+p.nome+'. Para confirmar, responda esta mensagem ou acesse '+link()+' (Meus agendamentos › Lista de espera).'),'_blank');
    toast('Oferta enviada ✔');draw()}catch(x){alert('Erro: '+(x.code||x.message)+'\nPublique as regras novas do Firestore.')}};
acts.wlbook=b=>{const e=ESP.find(x=>x.id==b.dataset.id);DAYSEL=e.data;openNovo({data:e.data,nome:e.nome,tel:e.tel,prof:e.prof||'',esp:e.id})};
const espSet=async(id,o,msg)=>{try{await setDoc(doc(db,'saloes',OID,'espera',id),o,{merge:true});toast(msg);draw()}catch(e){alert('Erro: '+(e.code||e.message))}};
acts.wldone=b=>espSet(b.dataset.id,{status:'atendido',oferta:null},'Marcado como atendido');
acts.wlrm=b=>{if(confirm('Remover da lista de espera?'))espSet(b.dataset.id,{status:'cancelado',oferta:null},'Removido')};
/* ---- estilos do sistema ---- */
const TEMAS={padrao:['Padrão','#f3f4f6','#ffffff','#1f2a37'],escuro:['Escuro','#0f1218','#181c24','#3b82f6'],classico:['Clássico','#faf6ee','#fffdf8','#8a6d3b'],moderno:['Moderno','#eef2ff','#ffffff','#4f46e5'],suave:['Suave','#fdf2f8','#ffffff','#db2777']};
const applyTema=t=>document.documentElement.setAttribute('data-tema',t&&TEMAS[t]?t:'padrao');
acts.tema=async b=>{syncPerfil();S.tema=b.dataset.t;applyTema(S.tema);await save();toast('Estilo aplicado ✔');draw()};

/* ====== NOTIFICAÇÕES (sininho) ====== */
let NTS=[],NTREAD=0;
const ntKey=()=>'hs_nt_'+OID+'_'+(ROLE=='prof'?ME:'o');
function ntLoad(){try{const o=JSON.parse(localStorage.getItem(ntKey())||'{}');NTS=o.l||[];NTREAD=o.r||0}catch(e){NTS=[];NTREAD=0}}
function ntSave(){try{localStorage.setItem(ntKey(),JSON.stringify({l:NTS.slice(0,40),r:NTREAD}))}catch(e){}}
function pend(){const L=[],hoje=iso(new Date());
  if(ROLE=='prof'){const n=AGALL.filter(a=>a.data==hoje&&a.status!='faltou'&&!a.status).length;if(n)L.push({txt:n+' atendimento(s) hoje',tab:'lista'})}
  else{const c=AGALL.filter(a=>a.pstatus=='aguardando').length,e=ESP.filter(x=>x.status=='aguardando'&&x.data>=hoje).length;if(c)L.push({txt:c+' comprovante(s) a conferir',tab:'pag'});if(e)L.push({txt:e+' pessoa(s) no encaixe / lista de espera',tab:'esp'})}
  return L}
const bellN=()=>NTS.filter(n=>n.t>NTREAD).length+pend().length;
const bellHtml=()=>{const n=bellN();return '🔔'+(n?`<i class=bdgn>${n>99?'99+':n}</i>`:'')};
function updBell(){const b=$('#bell');if(b)b.innerHTML=bellHtml()}
function notify(txt,tab){NTS.unshift({t:Date.now(),txt,tab});ntSave();toast('🔔 '+txt);updBell()}
acts.bell=()=>{const P=pend();NTREAD=Date.now();ntSave();
  openM(`<h2>🔔 Notificações</h2>${P.length?`<h3 style="margin:8px 0 4px">Pendências</h3>${P.map(x=>`<div class=row style="cursor:pointer" data-a=bnav data-t=${x.tab}><span>${esc(x.txt)}</span><span class=mu>›</span></div>`).join('')}`:''}<h3 style="margin:14px 0 4px">Novidades</h3>${NTS.length?NTS.slice(0,25).map(x=>`<div class=row ${x.tab?`style="cursor:pointer" data-a=bnav data-t=${x.tab}`:''}><span>${esc(x.txt)}<br><span class=mu style="font-size:.75rem">${new Date(x.t).toLocaleString('pt-BR')}</span></span></div>`).join(''):'<p class=mu>Sem novidades por enquanto.</p>'}<button class="btn o" data-a=closem>Fechar</button>`);updBell()};
acts.bnav=b=>{closeM();TAB=b.dataset.t;draw()};

/* ---- agendamento compartilhado (cliente e salão) ---- */
const busyAdd=(set,o)=>{const n=(o.m||30)/15;for(let k=0;k<n;k++)set.add(o.prof+'_'+o.data+'_'+hm(tm(o.hora)+k*15))};
const durOf=a=>a.dur||((a.blocos||[1]).length*30);
const wdOf=d=>new Date(d+'T12:00').getDay();
const elig=sv=>S.profissionais.filter(p=>act(p)&&(!(p.servs&&p.servs.length)||p.servs.includes(sv.id))&&(!B.local||!(p.locais&&p.locais.length)||p.locais.includes(B.local)));
function slotsInfo(prof,sv,d,busy){
  const H=hrsOf(prof);if(!H.dias.includes(wdOf(d))||H.folgas.includes(d))return[];
  const st=S.passo||30,u=Math.ceil(sv.min/15),now=new Date(),hoje=d==iso(now),out=[];
  for(let t=tm(H.abre);t+sv.min<=tm(H.fecha);t+=st){
    let ok=!(hoje&&t<=now.getHours()*60+now.getMinutes());
    if(ok)for(let k=0;k<u;k++){const b=t+k*15;if(busy.has(prof+'_'+d+'_'+hm(b))||(H.almI&&H.almF&&b>=tm(H.almI)&&b<tm(H.almF)))ok=false}
    out.push({h:hm(t),ok});
  }
  return out;
}
const slotsFor=(prof,sv,d,busy)=>slotsInfo(prof,sv,d,busy).filter(x=>x.ok).map(x=>x.h);
async function freeSlots(uid,prof,sv,d){
  if(!hrsOf(prof).dias.includes(wdOf(d)))return null;
  const q=await getDocs(query(collection(db,'ocupados'),where('uid','==',uid),where('data','==',d))),bs=new Set();q.docs.forEach(x=>busyAdd(bs,x.data()));
  return slotsFor(prof,sv,d,bs);
}
async function loadBusy(profId){
  const key=(B.mode||'prof')+'|'+profId;if(BUSYKEY==key)return;
  const q=profId?query(collection(db,'ocupados'),where('uid','==',ouid),where('prof','==',profId)):query(collection(db,'ocupados'),where('uid','==',ouid));
  const r=await getDocs(q),bs=new Set();r.docs.forEach(x=>busyAdd(bs,x.data()));BUSY=bs;BUSYKEY=key;if(B.old){const o=B.old,n=Math.ceil(durOf(o)/15);for(let k=0;k<n;k++)BUSY.delete(o.prof+'_'+o.data+'_'+hm(tm(o.hora)+k*15))}
}
async function commitAg(uid,pf,sv,d,h0,nome,tel,cuid,valor,email,por,forma,foto,extra){
  const w=writeBatch(db),blocos=[],n=Math.ceil(sv.min/15);
  for(let k=0;k<n;k++){const h=hm(tm(h0)+k*15),id=`${uid}_${pf.id}_${d}_${h.replace(':','')}`;blocos.push(id);w.set(doc(db,'ocupados',id),{uid,prof:pf.id,data:d,hora:h,cuid,m:15})}
  const ref=doc(collection(db,'saloes',uid,'agendamentos'));
  w.set(ref,{...(foto?{foto}:{}),...(extra||{}),forma:forma||'local',pstatus:'pendente',nome,tel,email:email||'',servico:sv.nome,servId:sv.id,prof:pf.id,profNome:pf.nome,data:d,hora:h0,valor:+(+valor).toFixed(2),dur:sv.min,ts:new Date(d+'T'+h0+':00').getTime(),blocos,cuid,por:por||'cliente',criado:Date.now()});
  await w.commit();return ref.id;
}
document.addEventListener('input',e=>{const t=e.target,i=t.id;if(t.dataset.money!=null)t.value=fmtM(parseM(t.value));if(i=='qs'){QS=t.value;$('#lst').innerHTML=listaRows()}if(i=='qc'){QC=t.value;$('#cl').innerHTML=cliRows()}});

acts.preset=b=>{$('#p4').value=b.dataset.c;document.querySelectorAll('[data-a=preset]').forEach(x=>x.style.borderColor=x==b?'#000':'#fff');theme(b.dataset.c)};

acts.capak=async b=>{syncPerfil();S.capaK=b.dataset.k;S.capa='';await save();toast('Capa alterada ✔');draw()};
acts.dlogo=async()=>{syncPerfil();S.logo='';await save();draw()};acts.dcapa=async()=>{syncPerfil();S.capa='';await save();draw()};
acts.sair=()=>{const pr=ROLE=='prof',sg=S&&S.slug;if(UNSUB)UNSUB();UNSUB=null;signOut(auth).then(()=>{if(pr)location.href=location.pathname+'?s='+sg})};
acts.copy=()=>navigator.clipboard.writeText(link()).then(()=>toast('Link copiado ✔'));
acts.del=async b=>{if(!confirm('Excluir este item?'))return;EDIT=null;if(b.dataset.l=='profissionais'){try{await setAcesso(S.profissionais[+b.dataset.i].id,'')}catch(e){}}S[b.dataset.l].splice(+b.dataset.i,1);await save();draw()};
const put=(l,o)=>{let x;if(EDIT&&EDIT.l==l){x=S[l][EDIT.i]={...S[l][EDIT.i],...o};EDIT=null}else{x={id:rid(),ativo:true,...o};S[l].push(x)}return x};
acts.tgl=async b=>{const x=S[b.dataset.l][+b.dataset.i];x.ativo=x.ativo===false;await save();draw()};
acts.ed=b=>{TMP={};EDIT={l:b.dataset.l,i:+b.dataset.i};draw();scrollTo(0,0)};
acts.noed=()=>{TMP={};EDIT=null;draw()};
acts.addserv=async()=>{if(!v('a1')||!(parseM(v('a2'))>0))return alert('Informe o nome e o valor do serviço.');put('servicos',{nome:v('a1'),preco:parseM(v('a2')),min:+v('a3')||30,cat:v('a4'),desc:v('a5')});await save();toast('Salvo ✔');draw()};
acts.addprof=async()=>{if(!v('a1'))return alert('Informe o nome.');const em=(v('a6')||'').toLowerCase();if(em&&!em.includes('@'))return alert('E-mail de acesso inválido.');
  const o={nome:v('a1'),funcao:v('a2'),servs:[...document.querySelectorAll('.ps:checked')].map(x=>x.value),locais:[...document.querySelectorAll('.pl:checked')].map(x=>x.value)};if(TMP.foto)o.foto=TMP.foto;
  const x=put('profissionais',o);TMP={};await save();
  try{await setAcesso(x.id,em);if(v('a7')!=='')await setComissao(x.id,+v('a7')||0)}catch(e){alert('Profissional salvo, mas o acesso não foi registrado ('+(e.code||e.message)+'). Publique as regras novas do Firestore.')}
  toast('Salvo ✔');draw()};
acts.addpromo=async()=>{if(!v('a1')||!(+v('a2')>0))return alert('Informe título e desconto.');put('promocoes',{titulo:v('a1'),pct:+v('a2'),servId:v('a3')});await save();toast('Salvo ✔');draw()};
acts.salhor=async()=>{S.abre=v('h1');S.fecha=v('h2');S.passo=+v('h5')||30;S.almI=v('h3');S.almF=v('h4');if(!S.almI||!S.almF)S.almI=S.almF='';S.dias=[...document.querySelectorAll('.dia:checked')].map(x=>+x.value);await save();toast('Horários salvos ✔')};
acts.salperfil=async()=>{S.nome=v('p1');S.whats=v('p2');S.end=v('p3');S.titulo=v('p5');S.sub=v('p6');S.cor=v('p4');await save();theme(S.cor);draw();toast('Perfil salvo ✔')};

/* ============ PÁGINA PÚBLICA DO CLIENTE ============ */
let B={},ouid='',step=1,SCR='',PLM='login',PLMSG='',PLSTAGE='';
const locs=()=>(S.locais||[]).filter(act),needLocal=()=>locs().length>=2,locOf=id=>(S.locais||[]).find(l=>l.id==id);
const newB=()=>{B={};const l=locs();if(l.length==1)B.local=l[0].id;step=l.length>=2?0:1};
const STEPS=()=>[...(needLocal()?[['Local',0]]:[]),['Serviço',1],['Data e hora',2],['Seus dados',3],['Pagamento',4]];
const stepper=n=>`<div class=stp>${STEPS().map((x,i)=>`<button class="${n==x[1]?'cur':n>x[1]?'done':''}" ${n>x[1]?`data-a=gostep data-s=${x[1]}`:'disabled'}><i>${n>x[1]?'✓':i+1}</i><span>${x[0]}</span></button>`).join('')}</div>`;
const rng=(h,sv)=>h+' – '+hm(tm(h)+sv.min);
const bsv=()=>S.servicos.find(s=>s.id==B.serv),bpf=()=>S.profissionais.find(p=>p.id==B.prof);
const total=()=>{const p=price(bsv(),S.promocoes),c=B.cupom?B.cupom.pct:0;return{final:+(p.final*(1-c/100)).toFixed(2),desc:c}};
const sumChips=()=>{const sv=bsv(),pf=bpf(),p=sv?total():null,lc=locOf(B.local);return `<div class=chips>${lc&&needLocal()?`<span>📍 ${esc(lc.nome)}</span>`:''}${sv?`<span>💈 ${esc(sv.nome)} · <b>${brl(p.final)}</b> · ${sv.min} min</span>`:''}${pf?`<span>👤 ${esc(pf.nome)}</span>`:B.any?'<span>👤 Qualquer profissional</span>':''}${B.data?`<span>📅 ${fd(B.data)}${B.hora?' às '+B.hora:''}</span>`:''}</div>`};
async function booking(sg){
  const sl=await getDoc(doc(db,'slugs',sg));
  if(!sl.exists()){A.innerHTML='<div class=wrap><div class=card><h2>Salão não encontrado</h2><p class=mu>Confira o link com o salão.</p></div></div>';return}
  ouid=sl.data().uid;S=(await getDoc(doc(db,'saloes',ouid))).data();S.cupons=S.cupons||[];S.locais=S.locais||[];
  try{(await getDocs(collection(db,'saloes',ouid,'agendas'))).docs.forEach(d=>{const p=S.profissionais.find(x=>x.id==d.id);if(p){p.hor=d.data().hor||undefined;p.folgas=d.data().folgas||[]}})}catch(e){}
  theme(S.cor);document.title=S.nome+' | Agendamento';newB();setManifest(S.nome,'');
  const cards=S.servicos.filter(act).map(x=>{const p=price(x,S.promocoes);return`<div class=card><h3>${esc(x.nome)}</h3>${x.desc?`<p class=mu>${esc(x.desc)}</p>`:''}<div class=pr>${p.pct?`<span class=old>${brl(x.preco)}</span>`:''}${brl(p.final)} · ${x.min}min</div></div>`}).join('')||'<p class=mu style="text-align:center">Em breve.</p>';
  A.innerHTML=`<div class=hd>${S.logo?`<img src="${S.logo}" alt="${esc(S.nome)}">`:`<b>${esc(S.nome)}</b>`}<nav><a href="#servicos">Serviços</a><a href="#agendamento">Agendar</a><span id=hu></span></nav></div>
  <div class=hero style="background:${cover(S.capa,S.capaK)}"><h1>${esc(S.titulo||S.nome)}</h1><p>${esc(S.sub||'Agende seu horário em poucos cliques.')}</p><a class=cta href="#agendamento">Agendar agora</a></div>
  ${S.promocoes.filter(act).length?`<div class=sec>${S.promocoes.filter(act).map(p=>`<div class=promo>🎉 <b>${esc(p.titulo)}</b> — ${p.pct}% de desconto</div>`).join('')}</div>`:''}
  <div class=sec id=servicos><h2 style="text-align:center;margin:30px 0 16px">Nossos serviços</h2><div class=sv>${cards}</div></div>
  <div class=wrap id=agendamento><h2 style="text-align:center;margin:30px 0 0">Faça seu agendamento</h2><div class=card id=wiz></div></div>
  <footer>© ${new Date().getFullYear()} ${esc(S.nome)}${S.end?' · '+esc(S.end):''}<br><a href="#!" class=install-link data-a=install style="color:#fff;text-decoration:underline">Instalar app</a></footer>`;
  applyTema(S.tema);hdr();wlListen();bk();
}
function bk(){
  const bar=stepper(step);let c='';
  if(step=='L'){
    const cad=CM=='cad';
    c=`<h2>${cad?'Criar conta':'Entrar'}</h2><p class=mu>Com uma conta você acompanha e cancela seus agendamentos.</p>${cad?'<label>Nome completo</label><input id=ln autocomplete=name><label>WhatsApp</label><input id=lt type=tel placeholder="(61) 99999-9999">':''}<label>E-mail</label><input id=le type=email autocomplete=email><label>Senha</label><input id=lp type=password placeholder="mínimo 6 caracteres"><button class=btn data-a=cgo>${cad?'Criar conta':'Entrar'}</button><button class="btn o" data-a=ctog>${cad?'Já tenho conta':'Criar conta'}</button><button class="btn o" data-a=home>Voltar</button>`;
  }
  if(step=='PL')c=plHtml();
  if(step=='M')c=`<h2>Meus agendamentos</h2><div id=ml><p class=mu>Carregando…</p></div><button class="btn o" data-a=novo>Novo agendamento</button>`;
  if(step==0)c=`${bar}<h2>Selecione o local do salão</h2><div class=lcs>${locs().map(l=>`<button class="lc ${B.local==l.id?'on':''}" data-a=pickloc data-l=${l.id}><b>${esc(l.nome)}</b><br><span class=mu>${esc(l.end||'')}</span></button>`).join('')}</div>`;
  if(step==1){
    const L=S.servicos.filter(act),cats=[...new Set(L.map(x=>x.cat||'Serviços'))],sv=bsv();
    const svc=cats.map(k=>`<h3 class=cat>${esc(k)}</h3>`+L.filter(x=>(x.cat||'Serviços')==k).map(x=>{const p=price(x,S.promocoes);return `<button class="sc ${B.serv==x.id?'on':''}" data-a=picksv data-s=${x.id}><span><b>${esc(x.nome)}</b>${x.desc?`<br><span class=mu>${esc(x.desc)}</span>`:''}</span><span class=spr>${p.pct?`<s>${brl(x.preco)}</s> `:''}<b>${brl(p.final)}</b><br><span class=mu>${x.min} min</span></span></button>`}).join('')).join('');
    let pf='';
    if(sv)pf=`<h2 id=pfh style="margin-top:18px">Escolha o profissional</h2><div class=pfs>
      <button data-a=pickprof data-p=any class="${B.mode=='data'&&B.any?'on':''}"><div class=av style="background:#9ca3af">?</div><b>Qualquer profissional</b><br><span class=mu>primeiro horário livre</span></button>
      ${elig(sv).map(p=>`<button data-a=pickprof data-p=${p.id} class="${B.mode=='prof'&&B.prof==p.id?'on':''}">${av(p)}<b>${esc(p.nome)}</b><br><span class=mu>${esc(p.funcao||'')}</span><br><span class=mu style="font-size:.7rem">${hrsOf(p.id).dias.map(d=>DIAS[d]).join(' · ')}</span></button>`).join('')}
      <button data-a=pickprof data-p=time class="${B.mode=='data'&&!B.any?'on':''}"><div class=av style="background:#6b7280">🕘</div><b>Escolher pelo horário</b><br><span class=mu>ver quem está livre</span></button></div>`;
    c=`${bar}<h2>Escolha o serviço</h2>${svc||'<p class=mu>Nenhum serviço cadastrado.</p>'}${pf}<div class=foot>${needLocal()?'<button class="btn o" data-a=back>Voltar</button>':''}<button class=btn data-a=n1>Continuar</button></div>`;
  }
  if(step==2)c='<p class=mu>Carregando disponibilidade…</p>';
  if(step==3){
    const nm=((CP&&CP.nome)||'').split(' '),fn=B.fn!=null?B.fn:(nm[0]||''),ln=B.ln!=null?B.ln:nm.slice(1).join(' ');
    c=`${bar}<h2>Informações do cliente</h2>${sumChips()}
    <div class=stl><b>As suas informações de contacto</b>${CU?`<span class=mu>Não é você? <a href="#agendamento" data-a=csair>Logout</a></span>`:`<span class=mu>Já tem conta? <a href="#agendamento" data-a=clogin>Entrar</a></span>`}</div>
    <div class=g2c><div><label>Primeiro nome</label><input id=cn autocomplete=given-name value="${esc(fn)}"></div><div><label>Sobrenome</label><input id=cs autocomplete=family-name value="${esc(ln)}"></div></div>
    <label>Telefone / WhatsApp</label><input id=ct type=tel placeholder="(61) 99999-9999" autocomplete=tel value="${esc(B.tel!=null?B.tel:CP&&CP.tel)}"><label>E-mail</label><input id=ce type=email autocomplete=email value="${esc(B.em!=null?B.em:(CU?CU.email:CP&&CP.email))}">
    <label>Adicionar comentários <span class=mu>(opcional)</span></label><textarea id=co rows=3>${esc(B.obs)}</textarea>
    <div class=foot><button class="btn o" data-a=back>Voltar</button><button class=btn data-a=n3>Próximo passo →</button></div>`;
  }
  if(step==4){
    const t=total(),pix=S.pixOn&&S.pixChave,fm=B.forma||'local';
    c=`${bar}<h2>Quando você gostaria de pagar pelo serviço?</h2><p class=mu>Você pode pagar agora por PIX ou pagar no salão no dia do atendimento.</p>
    <div class=pays><button class="pay ${fm=='local'?'on':''}" data-a=pforma data-f=local><span>🏪</span><b>Pague depois</b><small>no salão</small></button>${pix?`<button class="pay ${fm=='pix'?'on':''}" data-a=pforma data-f=pix><span>📱</span><b>Pague agora</b><small>PIX</small></button>`:''}</div>
    <div class=tot><div>Preço total da reserva: <b>${brl(t.final)}</b>${t.desc?` <span class=mu>(cupom ${esc(B.cupom.codigo)} −${t.desc}%)</span>`:''}</div>${(S.cupons||[]).some(act)?`<a href="#agendamento" data-a=cupbox>Tem um código de cupom?</a><div style="display:${B.cupOpen||B.cupom?'block':'none'}"><div style="display:flex;gap:8px;margin-top:8px"><input id=cpc placeholder="CÓDIGO" value="${esc(B.cupom?B.cupom.codigo:'')}"><button class="btn s" data-a=cupaply>Aplicar</button></div></div>`:''}</div>
    <div class=foot><button class="btn o" data-a=back>Voltar</button><button class=btn data-a=conf id=cf>Confirmar agendamento</button></div>`;
  }
  if(step==5){
    const sv=bsv(),pf=bpf(),lc=locOf(B.local),end=lc?lc.end:S.end,pg=B.forma=='pix'?'PIX':'Pagar no salão',kv=a=>`<div class=kv>${a.map(x=>`<div><span>${x[0]}</span><b>${x[1]||'—'}</b></div>`).join('')}</div>`;
    c=`<div class=ok><div class=big>✅</div><h2 style="margin:0">Agendamento confirmado!</h2><p class=mu style="margin-top:10px">CONFIRMAÇÃO #</p><div style="font-size:2rem;font-weight:700">${esc(B.code)}</div></div>
    <div class=noprint style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:10px 0"><button class="btn s o" data-a=ics>📅 Adicionar ao calendário</button><button class="btn s o" data-a=prt>🖨 Imprimir</button></div>
    <h3 class=sec3>Informações do agendamento</h3>${kv([['Data',fd(B.data)],['Horário',rng(B.hora,sv)],['Local',esc((lc?lc.nome+' — ':'')+(end||''))],['Profissional',esc(pf.nome)],['Serviço',esc(sv.nome)],['Tipo de pagamento',pg]])}
    <h3 class=sec3>Informações do cliente</h3>${kv([['Nome',esc(B.nome)],['Telefone',esc(B.tel)],['E-mail',esc(B.em)]])}
    <h3 class=sec3>Informações de pagamento</h3>${kv([['Método',B.forma=='pix'?'PIX':'Pagar localmente'],['Valor total devido',brl(B.valor)]])}
    ${B.forma=='pix'?'<div id=pixbox class=noprint style="margin:14px 0"></div>':''}
    <div class="foot noprint"><button class=btn data-a=finalizar>Finalizar</button></div>
    <div class=noprint style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">${S.whats?`<a class="btn s o" style="text-decoration:none" target=_blank href="${wa(S.whats,'Olá! Agendei '+sv.nome+' em '+fd(B.data)+' às '+B.hora+' (nome: '+B.nome+').')}">Avisar no WhatsApp do salão</a>`:''}<button class="btn s o" data-a=novo>Novo agendamento</button></div>
    ${CU?'':'<p class="mu noprint" style="margin-top:12px">Crie uma conta para acompanhar seus agendamentos: <a href="#agendamento" data-a=clogin>Entrar / Criar conta</a></p>'}`;
  }
  $('#wiz').innerHTML=c;
  if(step==5&&B.forma=='pix')showPix($('#pixbox'),B.valor,B.agId,true);
  if(step!=1&&step!==LS)$('#wiz').scrollIntoView();LS=step;
  if(step=='M')loadMeus();if(step==2)drawStep2();
  if(SCR&&step!=2){const e=$('#'+SCR);SCR='';if(e)e.scrollIntoView({behavior:'smooth',block:'start'})}
}
acts.back=()=>{step--;bk()};
acts.pickloc=b=>{B.local=b.dataset.l;const pf=bpf();if(pf&&pf.locais&&pf.locais.length&&!pf.locais.includes(B.local)){B.prof='';B.mode=''}step=1;bk()};
acts.picksv=b=>{B.serv=b.dataset.s;const pf=bpf();if(B.mode=='prof'&&pf&&pf.servs&&pf.servs.length&&!pf.servs.includes(B.serv)){B.prof='';B.mode=''}SCR='pfh';bk()};
acts.pickprof=b=>{const p=b.dataset.p;if(p=='any'){B.any=true;B.mode='data';B.prof=''}else if(p=='time'){B.any=false;B.mode='data';B.prof=''}else{B.any=false;B.mode='prof';B.prof=p}bk()};
acts.n1=()=>{if(!B.serv)return alert('Escolha o serviço.');if(!B.mode||(B.mode=='prof'&&!B.prof))return alert('Escolha o profissional (ou "Qualquer profissional").');BUSYKEY='';B.data='';B.hora='';CALC={y:new Date().getFullYear(),m:new Date().getMonth()};step=2;bk()};
acts.n2=()=>{step=3;bk()};
acts.n3=()=>{const fn=v('cn'),ln=v('cs'),tel=v('ct'),em=v('ce');
  if(fn.length<2)return alert('Informe seu nome.');if(tel.replace(/\D/g,'').length<10)return alert('Informe o telefone com DDD.');if(em&&!em.includes('@'))return alert('E-mail inválido.');
  B.fn=fn;B.ln=ln;B.tel=tel;B.em=em;B.obs=v('co');step=4;bk()};
acts.pforma=b=>{B.forma=b.dataset.f;bk()};
acts.cupbox=()=>{B.cupOpen=!B.cupOpen;bk()};
acts.cupaply=()=>{const cd=v('cpc').toUpperCase().replace(/\s/g,'');if(!cd){B.cupom=null;bk();return}const c=(S.cupons||[]).find(x=>act(x)&&x.codigo==cd);if(!c)return alert('Cupom inválido ou inativo.');B.cupom={codigo:c.codigo,pct:+c.pct};toast('Cupom aplicado ✔');bk()};
acts.clogin=()=>{CM='login';step='L';bk()};
acts.ctog=()=>{CM=CM=='cad'?'login':'cad';bk()};
acts.meus=()=>{step='M';bk()};
acts.home=()=>{step=(B.serv&&B.hora&&!B.done)?3:(needLocal()&&!B.local?0:1);bk()};
acts.novo=()=>{newB();bk()};
acts.finalizar=()=>{closeM();toast('Agendamento finalizado ✔');if(CU){step='M';bk()}else{newB();bk()}};
acts.csair=async()=>{await signOut(auth);if(WLUNSUB){WLUNSUB();WLUNSUB=null}CU=CP=null;hdr();if(step=='M')step=1;bk()};
acts.gostep=b=>{const n=+b.dataset.s;if(n<step){step=n;bk()}};
acts.cgo=async()=>{
  const em=v('le'),pw=v('lp');if(!em||pw.length<6)return alert('Informe e-mail e senha (mínimo 6 caracteres).');
  busy=true;
  try{
    if(CM=='cad'){const nome=v('ln'),tel=v('lt');if(nome.length<3||tel.replace(/\D/g,'').length<10)throw{message:'Informe nome e WhatsApp com DDD.'};
      CU=(await createUserWithEmailAndPassword(auth,em,pw)).user;CP={nome,tel,email:em};await setDoc(doc(db,'clientes',CU.uid),CP)}
    else{CU=(await signInWithEmailAndPassword(auth,em,pw)).user;CP=null;try{CP=(await getDoc(doc(db,'clientes',CU.uid))).data()||null}catch(e){}}
  }catch(e){busy=false;alert(['auth/invalid-credential','auth/wrong-password','auth/user-not-found'].includes(e.code)?'E-mail ou senha inválidos.':e.code=='auth/email-already-in-use'?'Este e-mail já tem conta. Use Entrar.':(e.message||'Erro ao entrar.'));return}
  busy=false;hdr();wlListen();step=(B.serv&&B.hora&&!B.done)?3:(needLocal()&&!B.local?0:1);bk();
};
/* ---- painel profissional: login ---- */
const plRefresh=()=>{if(STANDALONE)plRender();else bk()};
function plHtml(){
  const cad=PLM=='cad',home=STANDALONE?`<a class="btn o" style="display:block;text-align:center;text-decoration:none" href="index.html">Voltar ao início</a>`:'<button class="btn o" data-a=home>Voltar à página do salão</button>',cu=auth.currentUser;
  return `<h2>Painel do profissional</h2><p class=mu>Aqui você informa sua agenda e acompanha seus agendamentos, clientes e ganhos. Entre com o e-mail que o salão cadastrou para você.</p>
  ${cu&&PLSTAGE!='verify'?`<p class=mu style="background:var(--bg);border-radius:8px;padding:8px 10px">Você está conectado como <b>${esc(cu.email||'')}</b>. Esta conta não tem acesso de profissional neste salão. <a href="#!" data-a=ptrocar>Entrar com outra conta</a></p>`:''}
  ${PLSTAGE=='verify'?`<div class=quick style="display:block"><b>Confirme seu e-mail</b><p class=mu style="margin:6px 0">${esc(PLMSG)}</p><button class="btn s" data-a=plconf>Já confirmei</button> <button class="btn s o" data-a=plresend>Reenviar e-mail</button></div>`:`${PLMSG?`<p class=mu style="color:#b45309">${esc(PLMSG)}</p>`:''}<label>E-mail</label><input id=pe type=email autocomplete=email><label>Senha</label><input id=pp type=password placeholder="mínimo 6 caracteres"><button class=btn data-a=plgo>${cad?'Criar meu acesso':'Entrar'}</button><button class="btn o" data-a=pltog>${cad?'Já tenho acesso':'Primeiro acesso (criar senha)'}</button>`}
  ${home}`;
}
function plRender(){A.innerHTML=`<div class="top hero" style="background:${cover(S.capa,S.capaK)};padding:40px 16px">${S.logo?`<img class=lg src="${S.logo}">`:''}<h1>${esc(S.nome)}</h1><p>Painel do profissional</p><a href="#!" class=install-link data-a=install style="color:#fff;font-size:.9rem;display:inline-block;margin-top:10px;text-decoration:underline">Instalar app</a></div><div class=wrap><div class=card>${plHtml()}</div></div>`}
async function profPage(sg){
  const sl=await getDoc(doc(db,'slugs',sg));if(!sl.exists()){A.innerHTML='<div class=wrap><div class=card><h2>Salão não encontrado</h2><p class=mu>Confira o link com o salão.</p></div></div>';return}
  ouid=sl.data().uid;S=(await getDoc(doc(db,'saloes',ouid))).data();S.cupons=S.cupons||[];S.locais=S.locais||[];
  try{(await getDocs(collection(db,'saloes',ouid,'agendas'))).docs.forEach(d=>{const p=S.profissionais.find(x=>x.id==d.id);if(p){p.hor=d.data().hor||undefined;p.folgas=d.data().folgas||[]}})}catch(e){}
  theme(S.cor);applyTema(S.tema);document.title='Painel profissional | '+S.nome;setManifest(S.nome,'Profissional');
  const u=auth.currentUser;if(u&&u.emailVerified&&!ENTERING){profEnter();return}
  plRender();
}
acts.plogin=async()=>{PLM='login';PLMSG='';PLSTAGE='';if(CU&&auth.currentUser&&auth.currentUser.emailVerified){await profEnter();return}step='PL';plRefresh()};
acts.pltog=()=>{PLM=PLM=='cad'?'login':'cad';PLMSG='';plRefresh()};
acts.plgo=async()=>{
  const em=v('pe'),pw=v('pp');if(!em||pw.length<6)return alert('Informe e-mail e senha (mínimo 6 caracteres).');
  busy=true;
  try{
    let u;
    if(PLM=='cad'){u=(await createUserWithEmailAndPassword(auth,em,pw)).user;await sendEmailVerification(u);PLMSG='Enviamos um link de confirmação para '+em+'. Abra o e-mail, confirme e depois toque em "Já confirmei".'}
    else u=(await signInWithEmailAndPassword(auth,em,pw)).user;
    CU=u;busy=false;
    if(!u.emailVerified){if(PLM!='cad')PLMSG='Seu e-mail ainda não foi confirmado. Confirme pelo link que enviamos e toque em "Já confirmei".';PLSTAGE='verify';plRefresh();return}
    await profEnter();
  }catch(e){busy=false;alert(['auth/invalid-credential','auth/wrong-password','auth/user-not-found'].includes(e.code)?'E-mail ou senha inválidos.':e.code=='auth/email-already-in-use'?'Este e-mail já tem conta. Use "Já tenho acesso".':(e.message||'Erro ao entrar.'))}
};
acts.plconf=async()=>{try{await auth.currentUser.reload();if(!auth.currentUser.emailVerified)return alert('Ainda não confirmado. Abra o link do e-mail e tente de novo.');PLSTAGE='';await profEnter()}catch(e){alert('Erro: '+(e.code||e.message))}};
acts.plresend=async()=>{try{await sendEmailVerification(auth.currentUser);toast('E-mail reenviado ✔')}catch(e){alert('Erro: '+(e.code||e.message))}};
async function profEnter(){
  ENTERING=true;const u=auth.currentUser;if(!u){ENTERING=false;return}await u.getIdToken(true);let r;
  try{r=await getDoc(doc(db,'saloes',ouid,'acessos',u.email.toLowerCase()))}catch(e){PLMSG='Não foi possível verificar seu acesso ('+(e.code||'erro')+').';PLSTAGE='';ENTERING=false;step='PL';plRefresh();return}
  if(!r.exists()){PLMSG='O e-mail '+u.email+' ainda não foi autorizado por este salão. Peça ao responsável para cadastrá-lo em Profissionais.';PLSTAGE='';ENTERING=false;step='PL';plRefresh();return}
  ME=r.data().profId;ROLE='prof';OID=ouid;U=u;AGALL=[];LOADED=false;NOTAS={};TAB='pdash';LPF=ME;
  try{MYPCT=+((await getDoc(doc(db,'saloes',ouid,'comissaoPct',ME))).data()||{}).pct||0}catch(e){MYPCT=0}
  try{COMP={};(await getDocs(query(collection(db,'saloes',ouid,'comissoes'),where('profId','==',ME)))).docs.forEach(d=>COMP[d.id]=d.data())}catch(e){}
  ntLoad();theme(S.cor);applyTema(S.tema);listen();draw();
}
acts.pvolta=()=>{if(UNSUB)UNSUB();location.href=BASE+'index.html'};
acts.ptrocar=async()=>{try{await signOut(auth)}catch(e){}CU=null;PLMSG='';PLSTAGE='';ENTERING=false;if(ROLE=='prof'){location.href=location.pathname+'?s='+slug}else plRender()};
/* ---- meus agendamentos / remarcar / cancelar / lista de espera (cliente) ---- */
let MT='prox',WL=[],WLUNSUB=null;
const canChange=a=>new Date(a.data+'T'+a.hora+':00').getTime()-Date.now()>10*60000;
const whenTxt=a=>{const s=new Date(a.data+'T'+a.hora+':00'),n=new Date(),dd=Math.round((new Date(s.getFullYear(),s.getMonth(),s.getDate())-new Date(n.getFullYear(),n.getMonth(),n.getDate()))/864e5);return (dd==0?'Hoje':dd==1?'Amanhã':'Em '+dd+' dias')+' às '+a.hora};
const stLbl=a=>a.status=='concluido'?['Concluído','f']:a.status=='faltou'?['Faltou','i']:a.start+durOf(a)*6e4<=Date.now()?['Realizado','r']:a.start<=Date.now()?['Em andamento','f']:['Agendado','n'];
function agCard(a,i,big){
  const fut=a.start>Date.now(),st=stLbl(a);
  return `<div class="agc ${big?'big':''}"><div class=agd><b>${a.data.slice(8)}</b><span>${MES[+a.data.slice(5,7)-1].slice(0,3).toUpperCase()}</span></div><div class=agi><b>${esc(a.servico)}</b> <span class="tag tg-${st[1]}">${st[0]}</span><br><span class=mu>${a.hora} · com ${esc(a.profNome)}${a.localNome?' · '+esc(a.localNome):''}</span><br><span class=mu>${brl(a.valor)}</span> ${ptag(a)}
  <div class=aca>${a.comp?`<button class="btn s o" data-a=vcomp data-i=${i}>Ver comprovante</button>`:''}${a.forma=='pix'&&pOf(a)!='pago'&&S.pixChave?`<button class="btn s" data-a=cpay data-i=${i}>Pagar com PIX / comprovante</button>`:''}${fut?(canChange(a)?`<button class="btn s o" data-a=remarcar data-i=${i}>Remarcar</button><button class="btn s o" style="color:#c33;border-color:#c33" data-a=ccancel data-i=${i}>Cancelar</button>`:'<span class=mu style="font-size:.75rem">Alterações só até 10 min antes</span>'):''}</div></div></div>`;
}
async function loadMeus(){
  const box=$('#ml');if(!box||!CU)return;
  try{
    const [q,qe]=await Promise.all([getDocs(query(collection(db,'saloes',ouid,'agendamentos'),where('cuid','==',CU.uid))),getDocs(query(collection(db,'saloes',ouid,'espera'),where('cuid','==',CU.uid)))]);
    MY=q.docs.map(d=>{const a={id:d.id,...d.data()};a.start=new Date(a.data+'T'+a.hora+':00').getTime();return a});WL=qe.docs.map(d=>({id:d.id,...d.data()}));
    const now=Date.now(),fut=MY.filter(a=>a.start>now&&a.status!='faltou').sort((a,b)=>a.start-b.start),atual=MY.find(a=>a.start<=now&&now<a.start+durOf(a)*6e4&&a.status!='faltou'),
      hist=MY.filter(a=>a.start+durOf(a)*6e4<=now||a.status=='faltou').sort((a,b)=>b.start-a.start),prox=fut[0],hoje=iso(new Date()),wl=WL.filter(e=>e.status!='cancelado'&&e.status!='atendido'&&e.data>=hoje);
    let h='';
    if(atual)h+=`<div class=hl>🟢 Agendamento atual</div>${agCard(atual,MY.indexOf(atual),true)}`;
    if(prox)h+=`<div class=hl>⏭ Próximo serviço · ${whenTxt(prox)}</div>${agCard(prox,MY.indexOf(prox),true)}`;
    if(!atual&&!prox)h+='<p class=mu>Você não tem agendamentos futuros.</p>';
    const outros=fut.slice(1);
    h+=`<div class=tabs style="margin:16px 0 8px">${[['prox','Próximos ('+outros.length+')'],['hist','Histórico ('+hist.length+')'],['esp','Encaixe / espera ('+wl.length+')']].map(x=>`<button class="${MT==x[0]?'on':''}" data-a=mtab data-t=${x[0]}>${x[1]}</button>`).join('')}</div>`;
    if(MT=='prox')h+=outros.map(a=>agCard(a,MY.indexOf(a))).join('')||'<p class=mu>Nenhum outro agendamento futuro.</p>';
    if(MT=='hist')h+=hist.map(a=>agCard(a,MY.indexOf(a))).join('')||'<p class=mu>Seu histórico aparece aqui.</p>';
    if(MT=='esp')h+=wl.map(e=>{const i=WL.indexOf(e);return `<div class=agc><div class=agd><b>${e.data.slice(8)}</b><span>${MES[+e.data.slice(5,7)-1].slice(0,3).toUpperCase()}</span></div><div class=agi><b>${esc(e.servico||'Serviço')}</b> <span class="tag ${e.status=='ofertado'?'tg-f':'tg-r'}">${e.status=='ofertado'?'Horário disponível':'Aguardando'}</span><br><span class=mu>${e.profNome?esc(e.profNome):'Qualquer profissional'}</span>
      ${e.status=='ofertado'&&e.oferta?`<div class=quick style="display:block;margin:8px 0"><b>🔔 ${fd(e.oferta.data)} às ${e.oferta.hora} com ${esc(e.oferta.profNome)}</b><div class=aca><button class="btn s" data-a=wlaccept data-i=${i}>Aceitar e agendar</button><button class="btn s o" data-a=wlrefuse data-i=${i}>Recusar</button></div></div>`:'<br><span class=mu style="font-size:.8rem">Avisaremos você e o salão se um horário abrir.</span>'}
      <div class=aca><button class="btn s o" style="color:#c33;border-color:#c33" data-a=wlcancel data-i=${i}>Sair da lista</button></div></div></div>`}).join('')||'<p class=mu>Você não está em nenhuma lista de espera.</p>';
    box.innerHTML=h;
  }catch(e){box.innerHTML='<p class=mu>Não foi possível carregar seus agendamentos ('+esc(e.code||'erro')+').</p>'}
}
const cbn=()=>{const n=WL.filter(e=>e.status=='ofertado').length;return n?`<i class=bdgn style="position:static;display:inline-block;margin-left:2px">${n}</i>`:''};
acts.cbell=()=>{MT='esp';step='M';bk()};
acts.mtab=b=>{MT=b.dataset.t;loadMeus()};
acts.ccancel=async b=>{const a=MY[+b.dataset.i];if(!canChange(a))return alert('O cancelamento só é possível até 10 minutos antes do horário.');if(!confirm('Cancelar este agendamento? O horário voltará a ficar disponível.'))return;
  const w=writeBatch(db);(a.blocos||[]).forEach(id=>w.delete(doc(db,'ocupados',id)));w.delete(doc(db,'saloes',ouid,'agendamentos',a.id));
  try{await w.commit();toast('Agendamento cancelado — horário liberado');loadMeus()}catch(e){alert('Não foi possível cancelar ('+(e.code||'erro')+').')}};
acts.remarcar=b=>{const a=MY[+b.dataset.i];if(!canChange(a))return alert('A remarcação só é possível até 10 minutos antes do horário.');
  const sv=S.servicos.find(x=>x.id==a.servId),pf=S.profissionais.find(p=>p.id==a.prof);if(!sv||!pf)return alert('O serviço ou o profissional não está mais disponível. Cancele e agende de novo.');
  B={serv:sv.id,prof:pf.id,mode:'prof',local:a.local||'',resch:a.id,old:a};BUSYKEY='';CALC={y:new Date().getFullYear(),m:new Date().getMonth()};step=2;bk()};
acts.rback=()=>{newB();BUSYKEY='';step='M';bk()};
acts.rconf=async()=>{
  const a=B.old,sv=S.servicos.find(x=>x.id==a.servId);if(!canChange(a))return alert('A remarcação só é possível até 10 minutos antes do horário.');
  const oldIds=new Set(a.blocos||[]),n=Math.ceil(sv.min/15),nw=[];for(let k=0;k<n;k++){const hh=hm(tm(B.hora)+k*15);nw.push([`${ouid}_${a.prof}_${B.data}_${hh.replace(':','')}`,hh])}
  const w=writeBatch(db);oldIds.forEach(id=>{if(!nw.some(x=>x[0]==id))w.delete(doc(db,'ocupados',id))});
  nw.forEach(([id,hh])=>{if(!oldIds.has(id))w.set(doc(db,'ocupados',id),{uid:ouid,prof:a.prof,data:B.data,hora:hh,cuid:CU.uid,m:15})});
  w.update(doc(db,'saloes',ouid,'agendamentos',a.id),{data:B.data,hora:B.hora,blocos:nw.map(x=>x[0]),dur:sv.min,ts:new Date(B.data+'T'+B.hora+':00').getTime()});
  try{await w.commit()}catch(e){alert('Esse horário acabou de ser ocupado ou não pôde ser alterado. Escolha outro.');BUSYKEY='';B.hora='';drawStep2();return}
  toast('Agendamento remarcado ✔');newB();BUSYKEY='';step='M';bk();
};
acts.vcomp=b=>{const a=MY[+b.dataset.i];openM('<h2>Comprovante enviado</h2><img src="'+a.comp+'" style="max-width:100%;border-radius:8px"><button class="btn o" data-a=closem>Fechar</button>')};
acts.cpay=b=>{const a=MY[+b.dataset.i];openM('<h2>Pagamento via PIX</h2><p class=mu>Faltam <b>'+brl(Math.max(0,a.valor-(a.pvalor||0)))+'</b></p><div id=pbx></div><button class="btn o" data-a=closem>Fechar</button>');showPix($('#pbx'),Math.max(0,a.valor-(a.pvalor||0)),a.id,true)};
/* lista de espera */
acts.wlopen=()=>{const amanha=iso(new Date(Date.now()+864e5)),nm=(CP&&CP.nome)||((B.fn||'')+' '+(B.ln||'')).trim();
  openM(`<h2>Encaixe / lista de espera</h2><p class=mu>Se um horário abrir no dia que você quer, avisamos você e o salão para fecharem o agendamento.</p><label>Dia desejado</label><input id=wd type=date min="${iso(new Date())}" value="${B.data||amanha}"><label>Seu nome</label><input id=wn value="${esc(nm)}"><label>WhatsApp</label><input id=wt type=tel placeholder="(61) 99999-9999" value="${esc((CP&&CP.tel)||B.tel||'')}"><label>Observação (opcional)</label><input id=wo placeholder="Ex.: só à tarde"><button class=btn data-a=wlsave>Entrar na lista de espera</button><button class="btn o" data-a=closem>Cancelar</button>`)};
acts.wlsave=async()=>{const nome=v('wn'),tel=v('wt'),d=v('wd'),sv=bsv(),pf=B.mode=='prof'?bpf():null;
  if(!d||nome.length<2||tel.replace(/\D/g,'').length<10)return alert('Informe o dia, seu nome e o WhatsApp com DDD.');
  try{await setDoc(doc(collection(db,'saloes',ouid,'espera')),{nome,tel,email:CU?CU.email:'',cuid:CU?CU.uid:'',servId:sv.id,servico:sv.nome,min:sv.min,prof:pf?pf.id:'',profNome:pf?pf.nome:'',data:d,local:B.local||'',obs:v('wo'),status:'aguardando',criado:Date.now()});
    closeM();toast('Você entrou na lista de espera ✔');if(!CU)alert('Pronto! O salão entrará em contato pelo WhatsApp se abrir um horário. Crie uma conta para acompanhar a lista de espera pelo app.')}
  catch(e){alert('Não foi possível entrar na lista ('+(e.code||e.message)+').')}};
acts.wlcancel=async b=>{const e=WL[+b.dataset.i];if(!confirm('Sair da lista de espera?'))return;try{await setDoc(doc(db,'saloes',ouid,'espera',e.id),{status:'cancelado',oferta:null},{merge:true});loadMeus()}catch(x){alert('Erro: '+(x.code||x.message))}};
acts.wlrefuse=async b=>{const e=WL[+b.dataset.i];try{await setDoc(doc(db,'saloes',ouid,'espera',e.id),{status:'aguardando',oferta:null},{merge:true});toast('Ok, você continua na lista');loadMeus()}catch(x){alert('Erro: '+(x.code||x.message))}};
acts.wlaccept=async b=>{const e=WL[+b.dataset.i],o=e.oferta,pf=S.profissionais.find(p=>p.id==o.prof),sv=S.servicos.find(x=>x.id==e.servId)||{id:'',nome:e.servico,min:e.min||30,preco:0};
  try{const L=await freeSlots(ouid,o.prof,sv,o.data);
    if(!L||!L.includes(o.hora)){alert('Esse horário já foi ocupado. Você continua na lista de espera.');await setDoc(doc(db,'saloes',ouid,'espera',e.id),{status:'aguardando',oferta:null},{merge:true});loadMeus();return}
    const p=price(sv,S.promocoes);await commitAg(ouid,pf,sv,o.data,o.hora,e.nome,e.tel,CU.uid,p.final,e.email||CU.email,'cliente','local',(CP&&CP.foto)||'',{obs:'Agendado pela lista de espera'});
    await setDoc(doc(db,'saloes',ouid,'espera',e.id),{status:'atendido',oferta:null},{merge:true});toast('Agendamento confirmado ✔');MT='prox';loadMeus()}
  catch(x){alert('Não foi possível agendar: '+(x.code||x.message))}};
function wlListen(){if(WLUNSUB){WLUNSUB();WLUNSUB=null}if(!CU||!ouid||ROLE=='prof')return;let first=true;
  try{WLUNSUB=onSnapshot(query(collection(db,'saloes',ouid,'espera'),where('cuid','==',CU.uid)),snap=>{if(!first)snap.docChanges().forEach(c=>{if(c.type=='modified'&&c.doc.data().status=='ofertado')toast('🔔 Abriu um horário na sua lista de espera!')});first=false;WL=snap.docs.map(d=>({id:d.id,...d.data()}));hdr();if(step=='M')loadMeus()},()=>{})}catch(e){}}

/* ---- passo 2: data e horário ---- */
const WK=['SEG','TER','QUA','QUI','SEX','SÁB','DOM'];
function nextFree(sv,md){const t=new Date();for(let i=0;i<120;i++){const d=iso(new Date(t.getFullYear(),t.getMonth(),t.getDate()+i));let best=null;
  (md?elig(sv):[bpf()]).forEach(p=>{const L=slotsFor(p.id,sv,d,BUSY);if(L.length&&(!best||L[0]<best.h))best={d,h:L[0],p:p.id}});if(best)return best}return null}
function dayRatio(d,sv,md){let ok=0,tot=0;
  if(md){const m={};elig(sv).forEach(p=>slotsInfo(p.id,sv,d,BUSY).forEach(x=>{m[x.h]=m[x.h]||x.ok}));Object.values(m).forEach(v=>{tot++;if(v)ok++})}
  else slotsInfo(B.prof,sv,d,BUSY).forEach(x=>{tot++;if(x.ok)ok++});
  return{ok,tot}}
async function drawStep2(){
  const sv=bsv(),md=B.mode=='data',pf=bpf(),wiz=$('#wiz');
  wiz.innerHTML='<p class=mu>Carregando disponibilidade…</p>';
  try{await loadBusy(md?'':B.prof)}catch(e){wiz.innerHTML='<p class=mu>Não foi possível carregar a disponibilidade. Tente de novo.</p><div class=foot><button class="btn o" data-a=back>Voltar</button></div>';return}
  const {y,m}=CALC,now=new Date(),hoje=iso(now),start=(new Date(y,m,1).getDay()+6)%7,dim=new Date(y,m+1,0).getDate();
  let cells=WK.map((d,i)=>`<div class="h ${i>4?'we':''}">${d}</div>`).join('')+'<div></div>'.repeat(start);
  for(let d=1;d<=dim;d++){const ds=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`,r=ds>=hoje?dayRatio(ds,sv,md):{ok:0,tot:0};
    cells+=r.ok>0?`<button class="cd ok ${ds==B.data?'on':''} ${ds==hoje?'hj':''}" data-a=cday data-d=${ds}><b>${d}</b><i class=bar><u style="width:${Math.round(r.ok/r.tot*100)}%"></u></i></button>`:`<button class="cd ${ds==hoje?'hj':''}" disabled><b>${d}</b></button>`}
  const none='<p class=mu style="grid-column:1/-1">Sem horários neste dia.</p>',btn=(h,ok)=>ok?`<button class="av2 ${h==B.hora?'on':''}" data-a=pick data-h=${h}>${rng(h,sv)}</button>`:`<button class=un disabled>${rng(h,sv)}</button>`;let sl='',pfx='',done=false;
  if(B.data){
    if(!md){const L=slotsInfo(B.prof,sv,B.data,BUSY);sl=L.length?L.map(x=>btn(x.h,x.ok)).join(''):none;done=!!B.hora}
    else{const mp={},all={};elig(sv).forEach(p=>slotsInfo(p.id,sv,B.data,BUSY).forEach(x=>{all[x.h]=all[x.h]||x.ok;if(x.ok)(mp[x.h]=mp[x.h]||[]).push(p)}));const ts=Object.keys(all).sort();
      sl=ts.length?ts.map(h=>btn(h,all[h])).join(''):none;
      if(B.hora&&mp[B.hora]){const c2=mp[B.hora];
        if(B.any){B.prof=c2[0].id;done=true;pfx=`<p class=mu id=pfx style="margin-top:12px">Profissional atribuído: <b>${esc(c2[0].nome)}</b></p>`}
        else{if(c2.length==1)B.prof=c2[0].id;pfx=`<h3 id=pfx style="margin:16px 0 6px">Profissionais disponíveis às ${B.hora}</h3><div class=pfs>${c2.map(p=>`<button data-a=pickp2 data-p=${p.id} class="${B.prof==p.id?'on':''}">${av(p)}<b>${esc(p.nome)}</b><br><span class=mu>${esc(p.funcao||'')}</span></button>`).join('')}</div>`;done=!!B.prof&&c2.some(p=>p.id==B.prof)}}}
  }
  const q=nextFree(sv,md),yrs=[now.getFullYear(),now.getFullYear()+1,now.getFullYear()+2];
  wiz.innerHTML=`${B.resch?'<h2 style="margin-top:0">Remarcar agendamento</h2><p class=mu>Escolha o novo dia e horário. Você pode remarcar até 10 minutos antes do atendimento.</p>':stepper(2)}${sumChips()}<h2>${md?'Escolha o dia e o horário':'Dia e horário de '+esc(pf.nome)}</h2>${!md&&pf?`<p class=mu style="margin:0 0 8px">${esc(pf.nome)} atende: ${resumo(hrsOf(pf.id))}</p>`:''}
  ${q?`<div class=quick><span>⚡ Próximo horário livre: <b>${fd(q.d)} · ${DIAS[wdOf(q.d)]} às ${q.h}</b></span><button class="btn s" data-a=quick data-d=${q.d} data-h=${q.h} data-p=${q.p}>Escolher</button></div>`:'<p class=mu>Sem horários livres nos próximos meses.</p>'}
  <div class=cnav><select id=cm>${MES.map((n,i)=>`<option value=${i} ${i==m?'selected':''} ${y==now.getFullYear()&&i<now.getMonth()?'disabled':''}>${n}</option>`).join('')}</select><select id=cy>${yrs.map(v=>`<option ${v==y?'selected':''}>${v}</option>`).join('')}</select><button class="btn s o" data-a=cnavm data-n=-1>‹</button><button class="btn s o" data-a=cnavm data-n=1>›</button></div>
  <div class=cal2>${cells}</div><p class=mu style="margin:6px 0">A barra verde mostra a disponibilidade de cada dia.</p>
  ${B.data?`<h3 id=slh style="margin:12px 0 6px">Escolha um tempo de agendamento para <span style="color:var(--c)">${fd(B.data)} · ${DIAS[wdOf(B.data)]}</span></h3><div class=slots>${sl}</div>`:''}${pfx}
  ${B.resch?'':'<div class=wl><b>Não encontrou o horário que queria?</b><p class=mu style="margin:4px 0 8px">Entre na lista de espera: se abrir um horário no dia desejado, avisamos você e o salão.</p><button class="btn s o" data-a=wlopen>Entrar na lista de espera / encaixe</button></div>'}<div class=foot>${B.resch?`<button class="btn o" data-a=rback>Cancelar</button><button class=btn data-a=rconf ${done?'':'disabled'}>Confirmar remarcação</button>`:`<button class="btn o" data-a=back>Voltar</button><button class=btn data-a=n2 ${done?'':'disabled'}>Continuar</button>`}</div>`;
  if(SCR){const e=$('#'+SCR);SCR='';if(e)e.scrollIntoView({behavior:'smooth',block:'start'})}
}
acts.quick=b=>{B.data=b.dataset.d;B.hora=b.dataset.h;if(B.mode=='data'&&!B.any){B.prof='';SCR='pfx'}CALC={y:+B.data.slice(0,4),m:+B.data.slice(5,7)-1};drawStep2()};
acts.cday=b=>{B.data=b.dataset.d;B.hora='';if(B.mode=='data')B.prof='';SCR='slh';drawStep2()};
acts.pick=b=>{B.hora=b.dataset.h;if(B.mode=='data'){B.prof='';SCR='pfx'}drawStep2()};
acts.pickp2=b=>{B.prof=b.dataset.p;drawStep2()};
acts.cnavm=b=>{let {y,m}=CALC;m+=+b.dataset.n;if(m<0){m=11;y--}if(m>11){m=0;y++}const n=new Date();if(y<n.getFullYear()||(y==n.getFullYear()&&m<n.getMonth()))return;CALC={y,m};drawStep2()};
/* ---- confirmar ---- */
acts.conf=async()=>{
  $('#cf').disabled=true;const sv=bsv(),t=total(),forma=B.forma||'local',nome=(B.fn+' '+(B.ln||'')).trim(),lc=locOf(B.local);
  const extra={obs:B.obs||'',...(lc?{local:lc.id,localNome:lc.nome,localEnd:lc.end||''}:{}),...(B.cupom?{cupom:B.cupom.codigo,desconto:B.cupom.pct}:{})};
  let id;
  try{id=await commitAg(ouid,bpf(),sv,B.data,B.hora,nome,B.tel,CU?CU.uid:'',t.final,B.em||(CU?CU.email:''),'cliente',forma,(CP&&CP.foto)||'',extra)}
  catch(e){alert('Esse horário acabou de ser ocupado. Escolha outro.');BUSYKEY='';B.hora='';step=2;bk();return}
  B.agId=id;B.forma=forma;B.valor=t.final;B.nome=nome;B.code=id.slice(-6).toUpperCase();B.done=true;step=5;bk()
};
acts.ics=()=>{const sv=bsv(),lc=locOf(B.local),d=B.data.replace(/-/g,''),a=B.hora.replace(':','')+'00',e=hm(tm(B.hora)+sv.min).replace(':','')+'00',st=new Date().toISOString().replace(/[-:]|\.\d+/g,'');
  const t=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//HorarioSalao//PT','BEGIN:VEVENT','UID:'+B.agId+'@horariosalao','DTSTAMP:'+st,'DTSTART:'+d+'T'+a,'DTEND:'+d+'T'+e,'SUMMARY:'+sv.nome+' - '+S.nome,'LOCATION:'+((lc&&lc.end)||S.end||''),'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const l=document.createElement('a');l.href=URL.createObjectURL(new Blob([t],{type:'text/calendar'}));l.download='agendamento.ics';l.click()};
acts.prt=()=>window.print();
