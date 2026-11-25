const entries = [
  ["Si hacés lo que siempre hiciste, obtenés lo que siempre obtuviste.", "La arena no premia la costumbre. Si querés otro resultado, cambiá la estrategia hoy mismo."],
  ["No te exijas demasiado, avanzá un poco cada día.", "La disciplina vence al impulso. Un paso firme cada jornada construye una muralla infranqueable."],
  ["El reino de Dios no es un lugar, es un estado.", "Tu fortaleza interior no depende de dónde estés parado, sino del dominio que ejercés sobre tu propia mente."],
  ["No prometas, hacé.", "Las palabras pesan poco en el campo de batalla; que tus actos hablen antes que tu voz."],
  ["Lo que se interpone en el camino se convierte en el camino.", "El obstáculo no frena tu marcha: es el hierro contra el que se afila tu carácter."],
  ["Primero decí qué querés ser; después hacé lo que tenés que hacer.", "Definí tu estándar sin excusas y sostenelo con hechos cuando nadie esté mirando."],
  ["No pierdas más tiempo discutiendo cómo debe ser un hombre bueno. Sé uno.", "Menos teoría y más temple: demostrá tu virtud en la próxima decisión difícil."],
  ["No te canses de hacer el bien, y a su tiempo vas a cosechar.", "El guerrero siembra con paciencia y resiste la espera sin abandonar su puesto."],
  ["El que construye sobre la roca resiste la tormenta.", "Cuando tus principios son firmes, ninguna crisis logra derrumbarte."],
  ["Nadie es más desdichado que aquel a quien nunca le tocó una adversidad.", "Sin combate no hay medida de tu fuerza. Agradecé la prueba que te obliga a crecer."],
  ["Nadie se hizo sabio por casualidad.", "La templanza y el criterio se forjan a golpe de estudio, caída y corrección diaria."],
  ["El arte de vivir se parece más a la lucha que a la danza.", "Mantené la guardia alta: vivir con honor exige estar listo para el impacto inesperado."],
  ["El alma se tiñe del color de sus pensamientos.", "Vigilá lo que alimentás en tu cabeza; tus pensamientos deciden si avanzás como señor o como esclavo."],
  ["No es que no nos animemos porque las cosas son difíciles. Son difíciles porque no nos animamos.", "El miedo agranda al rival. En cuanto das el primer paso al frente, la dificultad pierde autoridad."],
  ["No es pobre el que tiene poco, sino el que desea más.", "Quien domina sus deseos es invencible; nadie puede quitarle lo que no necesita."],
  ["El que está en todas partes no está en ninguna.", "Concentrá toda tu fuerza en un solo frente. La dispersión debilita hasta al más fuerte."],
  ["Mientras vivas, seguí aprendiendo a vivir.", "El entrenamiento nunca termina: cada día es una nueva oportunidad para templar el espíritu."],
  ["Elegí a alguien bueno y viví como si te estuviera mirando.", "Sostené tu conducta a la altura de los mejores hombres, incluso en la soledad."],
  ["Querer curarse ya es parte de la cura.", "Reconocer la herida sin mentirse es el primer acto de coraje para volver a ponerse de pie."],
  ["No nos perturban las circunstancias, sino lo que opinamos de ellas.", "El golpe ocurre afuera, pero el daño solo entra si tu juicio le abre la puerta."],
  ["El hombre bueno saca lo mejor de lo que le toca, como un buen general usa el ejército que tiene.", "No esperes condiciones ideales: peleá y vencé con los recursos que tenés hoy en la mano."]
];

const $ = id => document.getElementById(id);
const dateKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
function dayIndex(d) {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d - start) / 86400000) % entries.length;
}

const today = new Date();
const key = dateKey(today);
const idx = dayIndex(today);
const entry = entries[idx];

$('date').textContent = today.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
$('number').textContent = `Jornada ${Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000)}`;
$('quote').textContent = `“${entry[0]}”`;
$('reflection').textContent = entry[1];

const read = (k) => { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch { return []; } };
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

let favs = read('ubd-favorites');
let history = read('ubd-history');

if (!history.some(x => x.date === key)) {
  history.unshift({ date: key, quote: entry[0], reflection: entry[1] });
  history = history.slice(0, 90);
  write('ubd-history', history);
}

function isFav() { return favs.some(x => x.quote === entry[0]); }
function updateFavButton() { $('favorite').textContent = isFav() ? '★ Guardada' : '☆ Guardar sentencia'; }
updateFavButton();

$('favorite').onclick = () => {
  if (isFav()) favs = favs.filter(x => x.quote !== entry[0]);
  else favs.unshift({ date: key, quote: entry[0], reflection: entry[1] });
  write('ubd-favorites', favs);
  updateFavButton();
  renderLists();
  toast(isFav() ? 'Guardada en tu arsenal' : 'Quitada de guardadas');
};

function toast(s) {
  $('toast').textContent = s;
  $('toast').classList.add('show');
  setTimeout(() => $('toast').classList.remove('show'), 2200);
}

$('copy').onclick = async () => {
  const t = `${entry[0]}\n\n${entry[1]}`;
  try { await navigator.clipboard.writeText(t); toast('Sentencia copiada'); }
  catch { toast('No se pudo copiar automáticamente'); }
};

$('share').onclick = async () => {
  const t = `${entry[0]}\n\n${entry[1]}`;
  if (navigator.share) {
    try { await navigator.share({ title: 'Un Buen Día · Temple Estoico', text: t }); } catch {}
  } else {
    try { await navigator.clipboard.writeText(t); toast('Copiada para compartir'); }
    catch { toast('Compartir no está disponible'); }
  }
};

function renderList(target, items, empty) {
  const el = $(target);
  el.innerHTML = '';
  if (!items.length) {
    el.innerHTML = `<div class="empty">${empty}</div>`;
    return;
  }
  items.forEach((x, i) => {
    const d = document.createElement('article');
    d.className = 'item';
    const p = document.createElement('p');
    p.textContent = `“${x.quote}”`;
    const sm = document.createElement('small');
    sm.textContent = `${x.date || ''} · ${x.reflection || ''}`;
    d.append(p, sm);
    if (target === 'favorite-list') {
      const b = document.createElement('button');
      b.className = 'secondary';
      b.textContent = 'Quitar';
      b.onclick = () => { favs.splice(i, 1); write('ubd-favorites', favs); renderLists(); };
      d.append(b);
    }
    el.append(d);
  });
}

function renderLists() {
  renderList('favorite-list', favs, 'Todavía no guardaste sentencias. Tocá “Guardar sentencia” cuando una te temple el carácter.');
  renderList('history-list', history, 'Todavía no hay jornadas anteriores. Volvé mañana para el siguiente principio.');
}
renderLists();

document.querySelectorAll('.tab').forEach(b => b.onclick = () => {
  document.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x === b));
  document.querySelectorAll('.section').forEach(x => x.classList.toggle('active', x.id === b.dataset.tab));
});

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
