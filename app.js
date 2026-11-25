const entries = [
["No necesitás ver todo el camino. A veces alcanza con confiar en el paso que hoy sí podés dar.","La claridad no siempre llega antes de empezar; muchas veces aparece mientras caminás."],
["Que la prisa del mundo no te haga olvidar el ritmo de tu propia vida.","Un árbol no crece más por mirar al de al lado. Tu proceso también merece paciencia."],
["Incluso después de la noche más larga, la luz encuentra una manera de volver.","No confundas un momento difícil con una vida difícil. Las estaciones cambian."],
["Hay una forma silenciosa de valentía en volver a intentarlo sin hacer ruido.","Hoy no necesitás demostrar nada. Solo estar presente y hacer lo mejor que puedas."],
["No todo lo que florece hace ruido; algunas de las cosas más hermosas crecen en silencio.","Dale tiempo a lo que estás construyendo, incluso cuando todavía no se vea."],
["La paz comienza cuando dejás de exigirte tener todas las respuestas hoy.","Podés avanzar con dudas. La certeza absoluta no es un requisito para vivir."],
["Agradecé la luz que llega, pero también reconocé la fuerza que encontraste en la oscuridad.","Lo que atravesaste también forma parte de la persona que estás aprendiendo a ser."],
["La vida no te pide que seas perfecto; te invita a estar despierto para lo que importa.","Elegí una cosa pequeña que haga bien a tu día y empezá por ahí."],
["A veces, crecer es aprender a soltar la versión de vos que ya cumplió su ciclo.","Cambiar no significa haberte perdido. También puede ser una manera de encontrarte."],
["Que hoy tengas el coraje de elegir lo que te hace bien, aunque sea de a poquito.","Los cambios profundos suelen comenzar con decisiones pequeñas y constantes."],
["No apures la primavera: hay raíces trabajando incluso cuando todavía no hay flores.","Lo invisible también cuenta. Descansar, aprender y esperar pueden ser parte del avance."],
["Cada amanecer es una invitación, no una obligación: podés comenzar de nuevo a tu manera.","No hace falta que hoy sea extraordinario. Que sea genuino ya es mucho."]
];
const $ = id => document.getElementById(id);
const dateKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
function dayIndex(d){const start=new Date(d.getFullYear(),0,0);return Math.floor((d-start)/86400000)%entries.length;}
const today = new Date(), key=dateKey(today), idx=dayIndex(today), entry=entries[idx];
$('date').textContent=today.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long'});
$('number').textContent=`Día ${Math.floor((today-new Date(today.getFullYear(),0,0))/86400000)}`;
$('quote').textContent=`“${entry[0]}”`; $('reflection').textContent=entry[1];
const read=(k)=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch{return []}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
let favs=read('ubd-favorites'), history=read('ubd-history');
if(!history.some(x=>x.date===key)){history.unshift({date:key,quote:entry[0],reflection:entry[1]});history=history.slice(0,90);write('ubd-history',history)}
function isFav(){return favs.some(x=>x.quote===entry[0])}
function updateFavButton(){$('favorite').textContent=isFav()?'♥ Guardada':'♡ Guardar frase'}
updateFavButton();
$('favorite').onclick=()=>{if(isFav())favs=favs.filter(x=>x.quote!==entry[0]);else favs.unshift({date:key,quote:entry[0],reflection:entry[1]});write('ubd-favorites',favs);updateFavButton();renderLists();toast(isFav()?'Guardada en tus favoritas':'Quitada de favoritas')};
function toast(s){$('toast').textContent=s;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),1800)}
$('copy').onclick=async()=>{const t=`${entry[0]}\n\n${entry[1]}`;try{await navigator.clipboard.writeText(t);toast('Frase copiada')}catch{toast('Tu navegador no permite copiar automáticamente')}};
$('share').onclick=async()=>{const t=`${entry[0]}\n\n${entry[1]}`;if(navigator.share){try{await navigator.share({title:'Un Buen Día',text:t})}catch{}}else{try{await navigator.clipboard.writeText(t);toast('Copiada para compartir')}catch{toast('Compartir no está disponible')}}};
function renderList(target,items,empty){const el=$(target);el.innerHTML='';if(!items.length){el.innerHTML=`<div class="empty">${empty}</div>`;return}items.forEach((x,i)=>{const d=document.createElement('article');d.className='item';const p=document.createElement('p');p.textContent=`“${x.quote}”`;const sm=document.createElement('small');sm.textContent=`${x.date||''} · ${x.reflection||''}`;d.append(p,sm);if(target==='favorite-list'){const b=document.createElement('button');b.className='secondary';b.textContent='Quitar de favoritas';b.onclick=()=>{favs.splice(i,1);write('ubd-favorites',favs);renderLists()};d.append(b)}el.append(d)})}
function renderLists(){renderList('favorite-list',favs,'Todavía no guardaste frases. Tocá “Guardar frase” cuando una te acompañe.');renderList('history-list',history,'Todavía no hay días anteriores. Volvé mañana para sumar una nueva frase.')}
renderLists();
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.section').forEach(x=>x.classList.toggle('active',x.id===b.dataset.tab))});
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const regs = await navigator.serviceWorker.getRegistrations();
    for (const reg of regs) {
      if (reg.active && reg.active.scriptURL.endsWith('/sw.js')) {
        await reg.unregister();
      }
    }
  });
}
