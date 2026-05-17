// ─── DATA ───────────────────────────────────────────
const consultas = [
  { dia:31, mes:'OUT', semana:'Sex', stripe:'stripe-blue', icon:'bi-heart-pulse-fill', iconBg:'#e8f0fe', iconColor:'#1e4fc2', esp:'Cardiologista', medico:'Dr. Carlos Henrique', local:'Hospital Sírio-Libanês', hora:'09:30', dur:'30 min', status:'confirmada', filter:['todas','proximas','confirmadas'] },
  { dia:18, mes:'OUT', semana:'Sáb', stripe:'stripe-green', icon:'bi-stethoscope', iconBg:'#dcfce7', iconColor:'#22c55e', esp:'Clínico Geral', medico:'Dra. Mariana Lopes', local:'Hospital Sancta Maggiore', hora:'10:00', dur:'30 min', status:'realizada', filter:['todas','realizadas'] },
  { dia:5,  mes:'OUT', semana:'Dom', stripe:'stripe-red', icon:'bi-bandaid-fill', iconBg:'#fee2e2', iconColor:'#ef4444', esp:'Ortopedista', medico:'Dr. Felipe Andrade', local:'Hospital Albert Einstein', hora:'14:00', dur:'30 min', status:'cancelada', filter:['todas','canceladas'] },
  { dia:20, mes:'SET', semana:'Sáb', stripe:'stripe-green', icon:'bi-eye-fill', iconBg:'#e0f2fe', iconColor:'#0ea5e9', esp:'Oftalmologista', medico:'Dra. Juliana Ribeiro', local:'Hospital das Clínicas', hora:'11:15', dur:'30 min', status:'realizada', filter:['todas','realizadas'] },
];

const conquistas = [
  { name:'Imune e Forte', pts:100, desc:'Tomou todas as vacinas de prevenção', emoji:'💉', status:'desbloqueadas', prog:null },
  { name:'Pontual', pts:150, desc:'Compareceu a 3 consultas sem faltar', emoji:'⏰', status:'andamento', prog:66 },
  { name:'Ativo', pts:200, desc:'Mantém uma rotina de cuidados por 30 dias', emoji:'🏃', status:'andamento', prog:60 },
  { name:'Equilíbrio', pts:200, desc:'Registrou hábitos saudáveis por 30 dias', emoji:'⚖️', status:'andamento', prog:46 },
  { name:'Focado', pts:300, desc:'Complete 5 desafios de saúde', emoji:'🎯', status:'bloqueadas', prog:0 },
  { name:'Constante', pts:500, desc:'Mantenha 90 dias de rotina', emoji:'📅', status:'bloqueadas', prog:0 },
  { name:'Campeão', pts:1000, desc:'Alcance o topo do ranking mensal', emoji:'🏆', status:'bloqueadas', prog:0 },
  { name:'Cuidado Total', pts:1500, desc:'Complete todos os desafios', emoji:'⭐', status:'bloqueadas', prog:0 },
];

const rankingData = [
  { name:'Ana Souza', pts:1200, color:'#f59e0b' },
  { name:'Bruno Lima', pts:1100, color:'#3b82f6' },
  { name:'Carla Mendes', pts:980, color:'#8b5cf6' },
  { name:'Diego Santos', pts:950, color:'#22c55e' },
  { name:'Elena Costa', pts:920, color:'#ef4444' },
  { name:'Fernando Rocha', pts:890, color:'#14b8a6' },
  { name:'Gabriela Ferreira', pts:875, color:'#f97316' },
  { name:'Henrique Alves', pts:860, color:'#06b6d4' },
  { name:'Isabela Nunes', pts:855, color:'#ec4899' },
  { name:'Lucas Oliveira', pts:850, color:'#1e4fc2', isMe:true },
];

const chatResponses = {
  'agendar consulta': 'Claro! Para agendar uma consulta, você pode usar o botão "Agendar consulta" no topo da tela, ou me dizer a especialidade desejada e verificarei os horários disponíveis. 📅',
  'ver próximas consultas': 'Sua próxima consulta é com o Dr. Carlos Henrique (Cardiologista) no Hospital Sírio-Libanês, dia 31 de outubro às 09:30. Status: ✅ Confirmada.',
  'reagendar': 'Para reagendar, me informe a consulta desejada e o novo horário preferido. Posso verificar a disponibilidade e fazer o reagendamento para você! 🗓️',
  'falar sobre pontos': 'Você tem 850 pontos acumulados! 🏆 Faltam apenas 150 pontos para sua próxima conquista. Continue confirmando presença nas consultas para ganhar mais pontos!',
  'saber sobre o trajeto': 'Baseado na sua localização em São Paulo, o Hospital Sírio-Libanês fica a aproximadamente 25 minutos. Amanhã a previsão é de tempo bom ☀️, ótimo para se deslocar!',
};

// ─── LOGIN ───────────────────────────────────────────
function doLogin() {
  const cpf = document.getElementById('login-cpf').value.trim();
  const pwd = document.getElementById('login-pwd').value.trim();
  if (!cpf || !pwd) { toast('⚠️ Preencha CPF e senha.'); return; }
  document.getElementById('page-login').classList.remove('active');
  document.getElementById('page-app').classList.add('active');
  initApp();
}
function doLogout() {
  document.getElementById('page-app').classList.remove('active');
  document.getElementById('page-login').classList.add('active');
  document.getElementById('login-cpf').value = '';
  document.getElementById('login-pwd').value = '';
}

// ─── NAVIGATION ─────────────────────────────────────
const viewTitles = {
  inicio: ['Início','Bem-vindo ao CarePlus'],
  consultas: ['Minhas consultas','Acompanhe, confirme ou reagende suas consultas.'],
  calendario: ['Calendário','Gerencie suas consultas e compromissos'],
  chat: ['CarePlus','Sua assistente virtual de saúde'],
  conquistas: ['Conquistas','Complete desafios e ganhe recompensas'],
  ranking: ['Ranking','Veja sua posição entre outros usuários'],
  configuracoes: ['Configurações','Personalize sua experiência no CarePlus'],
};
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item-cp').forEach(b => b.classList.remove('active'));
  document.getElementById('view-'+name).classList.add('active');
  const btn = [...document.querySelectorAll('.nav-item-cp')].find(b => b.textContent.trim().toLowerCase().includes(name==='inicio'?'início':name));
  if (btn) btn.classList.add('active');
  const [title, sub] = viewTitles[name] || ['CarePlus',''];
  document.getElementById('page-title').textContent = title;
  document.getElementById('page-sub').textContent = sub;
  // hide sidebar on mobile
  if (window.innerWidth < 900) document.getElementById('sidebar').classList.remove('open');
}
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ─── INIT ────────────────────────────────────────────
function initApp() {
  renderConsultas('todas');
  renderConquistas('todas');
  renderRanking();
  renderCalendar();
}

// ─── CONSULTAS ───────────────────────────────────────
function renderConsultas(filter) {
  const list = document.getElementById('consultas-list');
  const items = consultas.filter(c => c.filter.includes(filter));
  list.innerHTML = items.map(c => {
    let statusBadge = '', actions = '';
    if (c.status === 'confirmada') {
      statusBadge = `<span class="badge-status badge-confirmada"><i class="bi bi-circle-fill" style="font-size:.5rem"></i> Confirmada</span>`;
      actions = `<button class="btn-outline-cp" onclick="toast('Detalhes abertos.')"><i class="bi bi-eye"></i> Ver detalhes</button>
                 <button class="btn-outline-cp" onclick="openModal()"><i class="bi bi-calendar"></i> Reagendar</button>`;
    } else if (c.status === 'realizada') {
      statusBadge = `<span class="badge-status badge-realizada"><i class="bi bi-circle-fill" style="font-size:.5rem"></i> Realizada</span>`;
      actions = `<button class="btn-outline-cp" onclick="toast('Detalhes abertos.')"><i class="bi bi-eye"></i> Ver detalhes</button>`;
    } else {
      statusBadge = `<span class="badge-status badge-cancelada"><i class="bi bi-circle-fill" style="font-size:.5rem"></i> Cancelada</span>`;
      actions = `<button class="btn-outline-cp" onclick="toast('Detalhes abertos.')"><i class="bi bi-eye"></i> Ver detalhes</button>
                 <button class="btn-outline-red" onclick="openModal()"><i class="bi bi-calendar-plus"></i> Agendar novamente</button>`;
    }
    return `<div class="consulta-item">
      <div class="consulta-stripe ${c.stripe}"></div>
      <div class="consulta-date"><div class="day">${c.dia}</div><div class="month">${c.mes}</div><div class="weekday">${c.semana}</div></div>
      <div class="consulta-icon-wrap" style="background:${c.iconBg}"><i class="bi ${c.icon}" style="color:${c.iconColor}"></i></div>
      <div class="consulta-info">
        <h4>${c.esp}</h4>
        <div class="doctor">${c.medico}</div>
        <div class="place"><i class="bi bi-geo-alt-fill"></i>${c.local}</div>
      </div>
      <div class="consulta-meta">
        <span><i class="bi bi-clock"></i>${c.hora}</span>
        <span><i class="bi bi-stopwatch"></i>${c.dur}</span>
      </div>
      <div style="min-width:120px; text-align:center">${statusBadge}</div>
      <div class="consulta-actions">${actions}</div>
    </div>`;
  }).join('') || `<div style="padding:40px; text-align:center; color:var(--gray-400)"><i class="bi bi-calendar-x" style="font-size:2rem; display:block; margin-bottom:10px"></i>Nenhuma consulta encontrada.</div>`;
}
function filterConsultas(filter, btn) {
  document.querySelectorAll('#consulta-tabs .filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderConsultas(filter);
}

// ─── CONQUISTAS ──────────────────────────────────────
function renderConquistas(filter) {
  const grid = document.getElementById('conquistas-grid');
  const items = filter === 'todas' ? conquistas : conquistas.filter(c => c.status === filter);
  grid.innerHTML = items.map(c => {
    const isUnlocked = c.status === 'desbloqueadas';
    const inProgress = c.status === 'andamento';
    const badgeClass = isUnlocked ? 'unlocked' : inProgress ? 'in-progress' : 'locked';
    const extra = isUnlocked
      ? `<div class="unlocked-label">✅ Desbloqueada</div>`
      : inProgress
      ? `<div class="progress-sm"><div class="progress-sm-fill" style="width:${c.prog}%"></div></div><div style="font-size:.72rem;color:var(--gray-400);margin-top:4px">${c.prog}/100</div>`
      : `<div style="font-size:.72rem;color:var(--gray-400);margin-top:6px">🔒 Bloqueada</div>`;
    return `<div class="col-sm-6 col-lg-3">
      <div class="conquista-card">
        <div class="conquista-badge ${badgeClass}">${c.emoji}</div>
        <div class="conquista-name">${c.name}</div>
        <div class="conquista-pts">⭐ ${c.pts} pontos</div>
        <div class="conquista-desc">${c.desc}</div>
        ${extra}
      </div>
    </div>`;
  }).join('');
}
function filterConquistas(filter, btn) {
  document.querySelectorAll('#conquista-tabs .filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderConquistas(filter);
}

// ─── RANKING ─────────────────────────────────────────
function renderRanking() {
  const list = document.getElementById('ranking-list');
  list.innerHTML = rankingData.map((r, i) => {
    const pos = i + 1;
    const posClass = pos === 1 ? 'top1' : pos === 2 ? 'top2' : pos === 3 ? 'top3' : '';
    const medal = pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : pos;
    const initials = r.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    return `<div class="ranking-row ${r.isMe ? 'rank-me' : ''}">
      <div class="rank-pos ${posClass}">${medal}</div>
      <div class="rank-av" style="background:${r.color}">${initials}</div>
      <div class="rank-name">${r.name}${r.isMe ? ' <span style="font-size:.72rem;color:var(--blue-main);font-weight:800">(você)</span>' : ''}</div>
      <div class="rank-pts">${r.pts.toLocaleString('pt-BR')} pts</div>
    </div>`;
  }).join('');
}

// ─── CALENDARIO ──────────────────────────────────────
let calYear = 2025, calMonth = 9; // October (0-indexed)
const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const eventDays = [31];
function renderCalendar() {
  const title = document.getElementById('cal-month-title');
  title.textContent = `${monthNames[calMonth]} ${calYear}`;
  const grid = document.getElementById('cal-grid');
  const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const totalDays = new Date(calYear, calMonth+1, 0).getDate();
  let html = days.map(d=>`<div class="cal-day-header">${d}</div>`).join('');
  for (let i=0; i<firstDay; i++) html += `<div class="cal-day empty other-month"></div>`;
  for (let d=1; d<=totalDays; d++) {
    const isToday = d===31 && calMonth===9 && calYear===2025;
    const hasEvent = eventDays.includes(d);
    html += `<div class="cal-day${isToday?' today':''}${hasEvent?' has-event':''}" onclick="selectDay(${d})">${d}</div>`;
  }
  grid.innerHTML = html;
}
function changeMonth(dir) { calMonth += dir; if(calMonth>11){calMonth=0;calYear++;} if(calMonth<0){calMonth=11;calYear--;} renderCalendar(); }
function selectDay(d) { toast(`Dia ${d} de ${monthNames[calMonth]} selecionado.`); }

// ─── CHAT ────────────────────────────────────────────
function sendChat() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  addMessage(msg, 'user');
  input.value = '';
  setTimeout(() => {
    const key = Object.keys(chatResponses).find(k => msg.toLowerCase().includes(k));
    const reply = key ? chatResponses[key] : 'Entendido! Posso te ajudar com agendamentos, informações sobre consultas, pontos e muito mais. O que você precisa? 😊';
    addMessage(reply, 'bot');
  }, 700);
}
function sendQuick(text) { document.getElementById('chat-input').value = text; sendChat(); }
function addMessage(text, type) {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `msg-bubble msg-${type}`;
  div.innerHTML = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

// ─── CONFIGURAÇÕES ───────────────────────────────────
function showConfig(panel, btn) {
  document.querySelectorAll('.config-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.config-sidebar-item').forEach(b => b.classList.remove('active'));
  document.getElementById('config-'+panel).classList.add('active');
  btn.classList.add('active');
}
function selectMode(el) { el.closest('.mode-btns').querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('selected')); el.classList.add('selected'); toast('Modo atualizado!'); }
function selectSwatch(el) { el.closest('.color-swatches').querySelectorAll('.color-swatch').forEach(s=>s.classList.remove('selected')); el.classList.add('selected'); toast('Cor principal atualizada!'); }
function selectFont(el) { el.closest('.font-btns').querySelectorAll('.font-btn').forEach(b=>b.classList.remove('selected')); el.classList.add('selected'); toast('Fonte atualizada!'); }

// ─── MODAL ───────────────────────────────────────────
function openModal() { document.getElementById('modal-overlay').classList.add('open'); }
function closeModal() { document.getElementById('modal-overlay').classList.remove('open'); }
function confirmAgendar() { closeModal(); toast('✅ Consulta agendada com sucesso! +50 pontos.'); }
document.getElementById('modal-overlay').addEventListener('click', e => { if(e.target===e.currentTarget) closeModal(); });

// ─── TOAST ───────────────────────────────────────────
function toast(msg) {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<i class="bi bi-check-circle-fill" style="color:var(--green)"></i> ${msg}`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// Allow pressing Enter on login
document.getElementById('login-pwd')?.addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });