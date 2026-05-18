// ═══════════════════════════════════════════════════
//  CarePlus — script.js
//  Inclui: login, navegação, consultas, chat,
//  calendário, conquistas, ranking, configurações
//  + sincronização de nome em todo o site (NOVO)
// ═══════════════════════════════════════════════════

// ─── ESTADO GLOBAL ─────────────────────────────────
let currentUser = {
  nome:       'Lucas Oliveira',
  cpf:        '123.456.789-00',
  email:      'lucas.oliveira@email.com',
  nascimento: '15/05/1998'
};

// ─── DATA ──────────────────────────────────────────
let consultas = [
  { id: 1, data:'2026-05-31', dia:31, mes:'MAI', semana:'Dom', stripe:'stripe-blue',  icon:'bi-heart-pulse-fill', iconBg:'#e8f0fe', iconColor:'#1e4fc2', esp:'Cardiologista',  medico:'Dr. Carlos Henrique',  local:'Hospital Sírio-Libanês',     hora:'09:30', dur:'30 min', status:'confirmada', filter:['todas','proximas','confirmadas'] },
  { id: 2, data:'2026-05-18', dia:18, mes:'MAI', semana:'Seg', stripe:'stripe-green', icon:'bi-stethoscope',       iconBg:'#dcfce7', iconColor:'#22c55e', esp:'Clínico Geral',   medico:'Dra. Mariana Lopes',    local:'Hospital Sancta Maggiore',   hora:'10:00', dur:'30 min', status:'realizada',  filter:['todas','realizadas'] },
  { id: 3, data:'2026-05-05', dia:5,  mes:'MAI', semana:'Ter', stripe:'stripe-red',   icon:'bi-bandaid-fill',      iconBg:'#fee2e2', iconColor:'#ef4444', esp:'Ortopedista',     medico:'Dr. Felipe Andrade',    local:'Hospital Albert Einstein',   hora:'14:00', dur:'30 min', status:'cancelada',  filter:['todas','canceladas'] },
  { id: 4, data:'2026-05-20', dia:20, mes:'MAI', semana:'Qua', stripe:'stripe-green', icon:'bi-eye-fill',          iconBg:'#e0f2fe', iconColor:'#0ea5e9', esp:'Oftalmologista',  medico:'Dra. Juliana Ribeiro',  local:'Hospital das Clínicas',      hora:'11:15', dur:'30 min', status:'realizada',  filter:['todas','realizadas'] },
];

const conquistas = [
  { name:'Imune e Forte',  pts:100,  desc:'Tomou todas as vacinas de prevenção',        emoji:'💉', status:'desbloqueadas', prog:null },
  { name:'Pontual',        pts:150,  desc:'Compareceu a 3 consultas sem faltar',        emoji:'⏰', status:'andamento',     prog:66   },
  { name:'Ativo',          pts:200,  desc:'Mantém uma rotina de cuidados por 30 dias',  emoji:'🏃', status:'andamento',     prog:60   },
  { name:'Equilíbrio',     pts:200,  desc:'Registrou hábitos saudáveis por 30 dias',    emoji:'⚖️', status:'andamento',     prog:46   },
  { name:'Focado',         pts:300,  desc:'Complete 5 desafios de saúde',               emoji:'🎯', status:'bloqueadas',    prog:0    },
  { name:'Constante',      pts:500,  desc:'Mantenha 90 dias de rotina',                 emoji:'📅', status:'bloqueadas',    prog:0    },
  { name:'Campeão',        pts:1000, desc:'Alcance o topo do ranking mensal',           emoji:'🏆', status:'bloqueadas',    prog:0    },
  { name:'Cuidado Total',  pts:1500, desc:'Complete todos os desafios',                 emoji:'⭐', status:'bloqueadas',    prog:0    },
];

const rankingData = [
  { name:'Ana Souza',         pts:1200, color:'#f59e0b' },
  { name:'Bruno Lima',        pts:1100, color:'#3b82f6' },
  { name:'Carla Mendes',      pts:980,  color:'#8b5cf6' },
  { name:'Diego Santos',      pts:950,  color:'#22c55e' },
  { name:'Elena Costa',       pts:920,  color:'#ef4444' },
  { name:'Fernando Rocha',    pts:890,  color:'#14b8a6' },
  { name:'Gabriela Ferreira', pts:875,  color:'#f97316' },
  { name:'Henrique Alves',    pts:860,  color:'#06b6d4' },
  { name:'Isabela Nunes',     pts:855,  color:'#ec4899' },
  { name:'Lucas Oliveira',    pts:850,  color:'#1e4fc2', isMe:true },
];

const chatResponses = {
  'agendar consulta':       'Claro! Para agendar uma consulta, use o botão "Agendar consulta" no topo da tela, ou me diga a especialidade desejada. 📅',
  'ver próximas consultas': 'Sua próxima consulta é com o Dr. Carlos Henrique (Cardiologista) no Hospital Sírio-Libanês, dia 31 de maio de 2026 às 09:30. Status: ✅ Confirmada.',
  'reagendar':              'Para reagendar, informe a consulta desejada e o novo horário preferido. 🗓️',
  'falar sobre pontos':     'Você tem 850 pontos acumulados! 🏆 Faltam apenas 150 pontos para sua próxima conquista.',
  'saber sobre o trajeto':  'O Hospital Sírio-Libanês fica a aproximadamente 25 minutos de São Paulo. Amanhã a previsão é de tempo bom ☀️!',
};

// ═══════════════════════════════════════════════════
//  SINCRONIZAÇÃO DE NOME EM TODO O SITE
//  Atualiza todos os elementos com [data-user-name],
//  [data-user-firstname], [data-user-initials]
//  e o greeting da home dinamicamente.
// ═══════════════════════════════════════════════════
function syncUserName() {
  const nome       = currentUser.nome.trim();
  const primeiroNome = nome.split(' ')[0];
  const iniciais   = nome.split(' ')
    .filter(Boolean)
    .map(w => w[0].toUpperCase())
    .slice(0, 2)
    .join('');

  // Elementos com [data-user-name] → nome completo
  document.querySelectorAll('[data-user-name]').forEach(el => {
    el.textContent = nome;
  });

  // Elementos com [data-user-firstname] → primeiro nome
  document.querySelectorAll('[data-user-firstname]').forEach(el => {
    el.textContent = primeiroNome;
  });

  // Elementos com [data-user-initials] → iniciais no avatar
  document.querySelectorAll('[data-user-initials]').forEach(el => {
    el.textContent = iniciais;
  });

  // Preview de aparência na tela de configurações
  const preview = document.getElementById('preview-nome');
  if (preview) preview.textContent = `Olá, ${primeiroNome}! 👋`;

  // Atualiza o ranking (linha "você") se já foi renderizado
  const rankingList = document.getElementById('ranking-list');
  if (rankingList && rankingList.children.length > 0) {
    renderRanking();
  }
}

// ═══════════════════════════════════════════════════
//  SALVAR DADOS DO PERFIL
//  Chamado pelo botão "Salvar alterações" em Configurações
// ═══════════════════════════════════════════════════
function salvarPerfil() {
  const inputNome = document.getElementById('input-nome');
  const inputCpf  = document.getElementById('input-cpf');
  const inputEmail= document.getElementById('input-email');
  const inputNasc = document.getElementById('input-nascimento');

  if (!inputNome) return;

  const novoNome = inputNome.value.trim();
  if (!novoNome) {
    toast('⚠️ O nome não pode estar vazio.');
    return;
  }

  // Atualiza estado global
  currentUser.nome       = novoNome;
  currentUser.cpf        = inputCpf  ? inputCpf.value  : currentUser.cpf;
  currentUser.email      = inputEmail? inputEmail.value : currentUser.email;
  currentUser.nascimento = inputNasc ? inputNasc.value  : currentUser.nascimento;

  // Propaga por todo o site
  syncUserName();

  toast(`✅ Dados salvos! Bem-vindo(a), ${novoNome.split(' ')[0]}!`);
}

// ─── LOGIN ─────────────────────────────────────────
function doLogin() {
  const cpf = document.getElementById('login-cpf').value.trim();
  const pwd = document.getElementById('login-pwd').value.trim();
  if (!cpf || !pwd) {
    toast('⚠️ Preencha CPF e senha.');
    return;
  }
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

// ─── NAVEGAÇÃO ─────────────────────────────────────
const viewTitles = {
  inicio:        ['Início',           'Bem-vindo ao CarePlus'],
  consultas:     ['Minhas consultas', 'Acompanhe, confirme ou reagende suas consultas.'],
  calendario:    ['Calendário',       'Gerencie suas consultas e compromissos'],
  chat:          ['CarePlus',         'Sua assistente virtual de saúde'],
  conquistas:    ['Conquistas',       'Complete desafios e ganhe recompensas'],
  ranking:       ['Ranking',          'Veja sua posição entre outros usuários'],
  configuracoes: ['Configurações',    'Personalize sua experiência no CarePlus'],
};

function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item-cp').forEach(b => b.classList.remove('active'));

  const view = document.getElementById('view-' + name);
  if (view) view.classList.add('active');

  // Ativa botão correto na sidebar
  const map = {
    inicio: 'início', consultas: 'consultas', calendario: 'calendário',
    chat: 'chat', conquistas: 'conquistas', ranking: 'ranking', configuracoes: 'configurações'
  };
  const label = map[name] || name;
  const btn = [...document.querySelectorAll('.nav-item-cp')]
    .find(b => b.textContent.trim().toLowerCase().includes(label));
  if (btn) btn.classList.add('active');

  const [title, sub] = viewTitles[name] || ['CarePlus', ''];
  document.getElementById('page-title').textContent = title;
  document.getElementById('page-sub').textContent   = sub;

  // Fecha sidebar no mobile
  if (window.innerWidth < 900) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ─── INIT ──────────────────────────────────────────
function initApp() {
  normalizarConsultas();
  renderConsultas('todas');
  renderConquistas('todas');
  renderRanking();
  renderCalendar();
  syncUserName(); // aplica nome do usuário em toda a UI
}


// ─── HELPERS DE CONSULTAS / DATAS ─────────────────────────
let consultaFiltroAtual = 'todas';
let selectedCalDay = null;

const mesesAbrev = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
const diasSemanaAbrev = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

function criarDataLocal(dateStr) {
  if (!dateStr) return null;
  const [ano, mes, dia] = dateStr.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

function atualizarCamposConsulta(c) {
  if (!c.id) c.id = Date.now() + Math.floor(Math.random() * 1000);

  if (!c.data) {
    const monthMap = { JAN:0, FEV:1, MAR:2, ABR:3, MAI:4, JUN:5, JUL:6, AGO:7, SET:8, OUT:9, NOV:10, DEZ:11 };
    const mesIndex = monthMap[c.mes] ?? 4;
    const ano = calYear || 2026;
    c.data = `${ano}-${String(mesIndex + 1).padStart(2, '0')}-${String(c.dia).padStart(2, '0')}`;
  }

  const data = criarDataLocal(c.data);
  if (data) {
    c.dia = data.getDate();
    c.mes = mesesAbrev[data.getMonth()];
    c.semana = diasSemanaAbrev[data.getDay()];
  }

  c.dur = c.dur || '30 min';
  c.filter = filtrosPorStatus(c.status);

  if (c.status === 'cancelada') {
    c.stripe = 'stripe-red';
  } else if (c.status === 'realizada') {
    c.stripe = 'stripe-green';
  } else {
    c.stripe = 'stripe-blue';
  }

  return c;
}

function normalizarConsultas() {
  consultas.forEach(atualizarCamposConsulta);
}

function filtrosPorStatus(status) {
  if (status === 'confirmada') return ['todas', 'proximas', 'confirmadas'];
  if (status === 'realizada') return ['todas', 'realizadas'];
  if (status === 'cancelada') return ['todas', 'canceladas'];
  return ['todas'];
}

function getIconPorEspecialidade(esp) {
  const mapa = {
    'Cardiologista':  ['bi-heart-pulse-fill', '#e8f0fe', '#1e4fc2'],
    'Clínico Geral':  ['bi-stethoscope', '#dcfce7', '#22c55e'],
    'Oftalmologista': ['bi-eye-fill', '#e0f2fe', '#0ea5e9'],
    'Ortopedista':    ['bi-bandaid-fill', '#fee2e2', '#ef4444'],
    'Dermatologista': ['bi-person-bounding-box', '#f3e8ff', '#8b5cf6'],
    'Neurologista':   ['bi-cpu-fill', '#fff7ed', '#f59e0b']
  };
  const [icon, iconBg, iconColor] = mapa[esp] || ['bi-clipboard2-pulse-fill', '#e8f0fe', '#1e4fc2'];
  return { icon, iconBg, iconColor };
}

function formatarDataBR(dateStr) {
  const data = criarDataLocal(dateStr);
  if (!data) return '';
  return data.toLocaleDateString('pt-BR');
}

function refreshConsultasUI() {
  normalizarConsultas();
  renderConsultas(consultaFiltroAtual);
  renderConsultaStats();
  renderCalendar();
  atualizarProximaConsultaHome();
  renderNotificacoes();
  if (selectedCalDay) atualizarDetalheDia(selectedCalDay);
}

function atualizarProximaConsultaHome() {
  const box = document.getElementById('home-proxima-content');
  if (!box) return;

  const futuras = consultas
    .filter(c => c.status === 'confirmada')
    .sort((a, b) => criarDataLocal(a.data) - criarDataLocal(b.data));

  if (!futuras.length) {
    box.innerHTML = '<p style="opacity:.7; font-size:.88rem">Nenhuma consulta agendada.</p>';
    return;
  }

  const c = futuras[0];
  box.innerHTML = `
    <div style="font-family:'Plus Jakarta Sans'; font-size:1.25rem; font-weight:800; margin-bottom:4px">${c.esp}</div>
    <div style="font-size:.88rem; opacity:.85">${c.medico}</div>
    <div style="font-size:.82rem; opacity:.75; margin-top:8px"><i class="bi bi-calendar-event"></i> ${formatarDataBR(c.data)} às ${c.hora}</div>
    <div style="font-size:.82rem; opacity:.75"><i class="bi bi-geo-alt"></i> ${c.local}</div>`;
}

// ─── CONSULTAS ─────────────────────────────────────
function renderConsultas(filter) {
  consultaFiltroAtual = filter || 'todas';
  normalizarConsultas();

  const list  = document.getElementById('consultas-list');
  if (!list) return;

  const items = consultas.filter(c => c.filter.includes(consultaFiltroAtual));

  list.innerHTML = items.map(c => {
    let statusBadge = '', actions = '';

    if (c.status === 'confirmada') {
      statusBadge = `<span class="badge-status badge-confirmada"><i class="bi bi-circle-fill" style="font-size:.5rem"></i> Confirmada</span>`;
      actions = `
        <button class="btn-outline-cp" onclick="detalhesConsulta(${c.id})"><i class="bi bi-eye"></i> Ver detalhes</button>
        <button class="btn-outline-cp" onclick="openModal('reagendar', ${c.id})"><i class="bi bi-calendar"></i> Reagendar</button>
        <button class="btn-outline-red" onclick="cancelarConsulta(${c.id})"><i class="bi bi-x-circle"></i> Cancelar</button>`;
    } else if (c.status === 'realizada') {
      statusBadge = `<span class="badge-status badge-realizada"><i class="bi bi-circle-fill" style="font-size:.5rem"></i> Realizada</span>`;
      actions = `<button class="btn-outline-cp" onclick="detalhesConsulta(${c.id})"><i class="bi bi-eye"></i> Ver detalhes</button>`;
    } else {
      statusBadge = `<span class="badge-status badge-cancelada"><i class="bi bi-circle-fill" style="font-size:.5rem"></i> Cancelada</span>`;
      actions = `
        <button class="btn-outline-cp" onclick="detalhesConsulta(${c.id})"><i class="bi bi-eye"></i> Ver detalhes</button>
        <button class="btn-outline-green" onclick="openModal('agendar')"><i class="bi bi-calendar-plus"></i> Agendar novamente</button>`;
    }

    return `
      <div class="consulta-item">
        <div class="consulta-stripe ${c.stripe}"></div>
        <div class="consulta-date">
          <div class="day">${c.dia}</div>
          <div class="month">${c.mes}</div>
          <div class="weekday">${c.semana}</div>
        </div>
        <div class="consulta-icon-wrap" style="background:${c.iconBg}">
          <i class="bi ${c.icon}" style="color:${c.iconColor}"></i>
        </div>
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
  }).join('') || `
    <div style="padding:40px; text-align:center; color:var(--gray-400)">
      <i class="bi bi-calendar-x" style="font-size:2rem; display:block; margin-bottom:10px"></i>
      Nenhuma consulta encontrada.
    </div>`;
}

function filterConsultas(filter, btn) {
  document.querySelectorAll('#consulta-tabs .filter-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderConsultas(filter);
}

function detalhesConsulta(id) {
  const c = consultas.find(item => item.id === id);
  if (!c) return;
  toast(`Consulta: ${c.esp} com ${c.medico} em ${formatarDataBR(c.data)} às ${c.hora}.`);
}

function cancelarConsulta(id) {
  const c = consultas.find(item => item.id === id);
  if (!c) return;

  c.status = 'cancelada';
  atualizarCamposConsulta(c);

  addNotificacao(
    'Consulta cancelada ❌',
    `${c.esp} de ${formatarDataBR(c.data)} às ${c.hora} foi cancelada.`,
    'bi-x-circle-fill',
    '#fee2e2',
    '#ef4444'
  );

  toast('Consulta cancelada ❌');
  refreshConsultasUI();
}

// ─── CONQUISTAS ────────────────────────────────────
function renderConquistas(filter) {
  const grid  = document.getElementById('conquistas-grid');
  const items = filter === 'todas' ? conquistas : conquistas.filter(c => c.status === filter);

  grid.innerHTML = items.map(c => {
    const isUnlocked  = c.status === 'desbloqueadas';
    const inProgress  = c.status === 'andamento';
    const badgeClass  = isUnlocked ? 'unlocked' : inProgress ? 'in-progress' : 'locked';
    const extra = isUnlocked
      ? `<div class="unlocked-label">✅ Desbloqueada</div>`
      : inProgress
      ? `<div class="progress-sm"><div class="progress-sm-fill" style="width:${c.prog}%"></div></div>
         <div style="font-size:.72rem;color:var(--gray-400);margin-top:4px">${c.prog}/100</div>`
      : `<div style="font-size:.72rem;color:var(--gray-400);margin-top:6px">🔒 Bloqueada</div>`;

    return `
      <div class="col-sm-6 col-lg-3">
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

// ─── RANKING ───────────────────────────────────────
function renderRanking() {
  const list = document.getElementById('ranking-list');
  if (!list) return;

  // Atualiza nome do usuário logado no array de ranking
  const meIdx = rankingData.findIndex(r => r.isMe);
  if (meIdx !== -1) {
    rankingData[meIdx].name = currentUser.nome;
  }

  list.innerHTML = rankingData.map((r, i) => {
    const pos      = i + 1;
    const posClass = pos === 1 ? 'top1' : pos === 2 ? 'top2' : pos === 3 ? 'top3' : '';
    const medal    = pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : pos;
    const initials = r.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    return `
      <div class="ranking-row ${r.isMe ? 'rank-me' : ''}">
        <div class="rank-pos ${posClass}">${medal}</div>
        <div class="rank-av" style="background:${r.color}">${initials}</div>
        <div class="rank-name">${r.name}${r.isMe ? ' <span style="font-size:.72rem;color:var(--blue-main);font-weight:800">(você)</span>' : ''}</div>
        <div class="rank-pts">${r.pts.toLocaleString('pt-BR')} pts</div>
      </div>`;
  }).join('');
}

// ─── CALENDÁRIO ────────────────────────────────────
let calYear = 2026, calMonth = 4; // Maio/2026. Em JavaScript, mês 4 = maio.
const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function renderCalendar() {
  const title = document.getElementById('cal-month-title');
  if (title) title.textContent = `${monthNames[calMonth]} ${calYear}`;

  const grid = document.getElementById('cal-grid');
  if (!grid) return;

  normalizarConsultas();

  const days     = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const total    = new Date(calYear, calMonth + 1, 0).getDate();
  const today    = new Date();

  let html = days.map(d => `<div class="cal-day-header">${d}</div>`).join('');

  for (let i = 0; i < firstDay; i++) {
    html += `<div class="cal-day empty other-month"></div>`;
  }

  for (let d = 1; d <= total; d++) {
    const isToday = d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
    const isSelected = selectedCalDay === d;
    const hasEvent = consultas.some(c => {
      const data = criarDataLocal(c.data);
      return data && data.getFullYear() === calYear && data.getMonth() === calMonth && data.getDate() === d && c.status !== 'cancelada';
    });

    html += `<div class="cal-day${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}${hasEvent ? ' has-event' : ''}" onclick="selectDay(${d})">${d}</div>`;
  }

  grid.innerHTML = html;
}

function changeMonth(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  selectedCalDay = null;
  renderCalendar();

  const title = document.getElementById('cal-detail-title');
  const content = document.getElementById('cal-detail-content');
  if (title) title.textContent = 'Selecione um dia';
  if (content) content.innerHTML = '<p style="color:var(--gray-400); font-size:.85rem">Clique em um dia para ver os detalhes.</p>';
}

function selectDay(d) {
  selectedCalDay = d;
  renderCalendar();
  atualizarDetalheDia(d);
}

function atualizarDetalheDia(d) {
  const title = document.getElementById('cal-detail-title');
  const content = document.getElementById('cal-detail-content');
  if (!title || !content) return;

  title.textContent = `${d} de ${monthNames[calMonth]} de ${calYear}`;

  const consultasDia = consultas.filter(c => {
    const data = criarDataLocal(c.data);
    return data && data.getFullYear() === calYear && data.getMonth() === calMonth && data.getDate() === d;
  });

  if (!consultasDia.length) {
    content.innerHTML = `
      <p style="color:var(--gray-400); font-size:.85rem; margin-bottom:12px">Nenhuma consulta neste dia.</p>
      <button class="btn-confirm" onclick="openModal('agendar')"><i class="bi bi-calendar-plus"></i> Agendar consulta</button>`;
    return;
  }

  content.innerHTML = consultasDia.map(c => `
    <div class="cal-consult-item">
      <h5>${c.esp}</h5>
      <p>${c.medico}</p>
      <p><i class="bi bi-clock"></i> ${c.hora} • ${c.local}</p>
      <p>Status: <strong>${c.status}</strong></p>
      ${c.status === 'confirmada' ? `
        <div style="display:flex; gap:8px; margin-top:10px; flex-wrap:wrap">
          <button class="btn-reagendar-sm" onclick="openModal('reagendar', ${c.id})">Reagendar</button>
          <button class="btn-cancel-sm" onclick="cancelarConsulta(${c.id})">Cancelar</button>
        </div>` : ''}
    </div>`).join('');
}

// ─── CHAT ──────────────────────────────────────────
function sendChat() {
  const input = document.getElementById('chat-input');
  const msg   = input.value.trim();
  if (!msg) return;
  addMessage(msg, 'user');
  input.value = '';
  setTimeout(() => {
    const key   = Object.keys(chatResponses).find(k => msg.toLowerCase().includes(k));
    const reply = key ? chatResponses[key] : 'Entendido! Posso te ajudar com agendamentos, consultas, pontos e muito mais. O que você precisa? 😊';
    addMessage(reply, 'bot');
  }, 700);
}

function sendQuick(text) {
  document.getElementById('chat-input').value = text;
  sendChat();
}

function addMessage(text, type) {
  const msgs = document.getElementById('chat-messages');
  const div  = document.createElement('div');
  div.className = `msg-bubble msg-${type}`;
  div.innerHTML = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

// ─── CONFIGURAÇÕES ─────────────────────────────────
function showConfig(panel, btn) {
  document.querySelectorAll('.config-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.config-sidebar-item').forEach(b => b.classList.remove('active'));
  const el = document.getElementById('config-' + panel);
  if (el) el.classList.add('active');
  btn.classList.add('active');
}

function selectMode(el) {
  el.closest('.mode-btns').querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  toast('Modo atualizado!');
}

function selectSwatch(el) {
  el.closest('.color-swatches').querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  toast('Cor principal atualizada!');
}

function selectFont(el) {
  el.closest('.font-btns').querySelectorAll('.font-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  toast('Fonte atualizada!');
}

// ─── MODAL ─────────────────────────────────────────
function openModal(mode = 'agendar', consultaId = '') {
  const overlay = document.getElementById('modal-overlay');
  const modalMode = document.getElementById('modal-mode');
  const modalConsultaId = document.getElementById('modal-consulta-id');
  const title = document.getElementById('modal-title');
  const subtitle = document.getElementById('modal-subtitle');
  const confirmBtn = document.querySelector('.btn-confirm-modal');
  const inputData = document.getElementById('modal-data');

  if (modalMode) modalMode.value = mode;
  if (modalConsultaId) modalConsultaId.value = consultaId || '';

  if (mode === 'reagendar') {
    if (title) title.textContent = 'Reagendar consulta';
    if (subtitle) subtitle.textContent = 'Altere os dados abaixo para reagendar sua consulta.';
    if (confirmBtn) confirmBtn.textContent = 'Confirmar reagendamento';

    const consulta = consultas.find(c => c.id === Number(consultaId));
    if (consulta) preencherModalComConsulta(consulta);
  } else {
    if (title) title.textContent = 'Agendar consulta';
    if (subtitle) subtitle.textContent = 'Preencha os dados para agendar sua consulta.';
    if (confirmBtn) confirmBtn.textContent = 'Confirmar agendamento';
    limparModalConsulta();

    if (inputData) {
      const dia = selectedCalDay ? String(selectedCalDay).padStart(2, '0') : '18';
      inputData.value = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${dia}`;
    }
  }

  if (overlay) overlay.classList.add('open');
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('open');
}

function limparModalConsulta() {
  const data = document.getElementById('modal-data');
  const hora = document.getElementById('modal-hora');
  const esp = document.getElementById('modal-esp');
  const medico = document.getElementById('modal-medico');
  const local = document.getElementById('modal-local');

  if (esp) esp.value = 'Cardiologista';
  if (medico) medico.value = 'Dr. Carlos Henrique';
  if (local) local.value = 'Hospital Sírio-Libanês';
  if (data) data.value = '2026-05-18';
  if (hora) hora.value = '09:30';
}

function preencherModalComConsulta(c) {
  const esp = document.getElementById('modal-esp');
  const medico = document.getElementById('modal-medico');
  const local = document.getElementById('modal-local');
  const data = document.getElementById('modal-data');
  const hora = document.getElementById('modal-hora');

  if (esp) esp.value = c.esp;
  if (medico) medico.value = c.medico;
  if (local) local.value = c.local;
  if (data) data.value = c.data;
  if (hora) hora.value = c.hora;
}

function confirmarModal() {
  const mode = document.getElementById('modal-mode')?.value || 'agendar';
  const consultaId = Number(document.getElementById('modal-consulta-id')?.value || 0);
  const esp = document.getElementById('modal-esp')?.value || 'Cardiologista';
  const medico = document.getElementById('modal-medico')?.value || 'Dr. Carlos Henrique';
  const local = document.getElementById('modal-local')?.value || 'Hospital Sírio-Libanês';
  const data = document.getElementById('modal-data')?.value;
  const hora = document.getElementById('modal-hora')?.value || '09:30';

  if (!data) {
    toast('⚠️ Selecione uma data para continuar.');
    return;
  }

  const iconData = getIconPorEspecialidade(esp);

  if (mode === 'reagendar') {
    const consulta = consultas.find(c => c.id === consultaId);
    if (!consulta) {
      toast('⚠️ Consulta não encontrada.');
      return;
    }

    Object.assign(consulta, {
      esp, medico, local, data, hora,
      status: 'confirmada',
      ...iconData
    });
    atualizarCamposConsulta(consulta);

    addNotificacao(
      'Consulta reagendada ✅',
      `${esp} reagendada para ${formatarDataBR(data)} às ${hora}.`,
      'bi-calendar-check-fill',
      '#e8f0fe',
      '#1e4fc2'
    );

    toast('Consulta reagendada ✅');
  } else {
    const novaConsulta = atualizarCamposConsulta({
      id: Date.now(),
      data, esp, medico, local, hora,
      dur: '30 min',
      status: 'confirmada',
      ...iconData
    });

    consultas.push(novaConsulta);

    addNotificacao(
      'Consulta agendada ✅',
      `${esp} agendada para ${formatarDataBR(data)} às ${hora}.`,
      'bi-calendar-plus-fill',
      '#dcfce7',
      '#22c55e'
    );

    toast('Consulta agendada ✅');
  }

  closeModal();
  refreshConsultasUI();
}

function confirmAgendar() {
  confirmarModal();
}

// Fecha modal clicando fora
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal();
    });
  }

  // Enter no login
  const pwdInput = document.getElementById('login-pwd');
  if (pwdInput) {
    pwdInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') doLogin();
    });
  }
});

// ─── TOAST ─────────────────────────────────────────
function toast(msg) {
  const container = document.getElementById('toast-container');
  const el        = document.createElement('div');
  el.className    = 'toast';
  el.innerHTML    = `<i class="bi bi-check-circle-fill" style="color:var(--green)"></i> ${msg}`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

//Função trocar de cores e alterar modo de exibição

const cores = document.querySelectorAll(".color")
cores.forEach(cor => {
  cor.addEventListener("clicar" , () => {
    const novaCor = cor.CDATA_SECTION_NODE.color;

    document.documentElement.style.setProperty("--Cor primaria" ,novaCor);
    
  })
})

// ═══════════════════════════════════════════════════
//  CORREÇÕES FINAIS — TEMA, CLIMA, STATS E NOTIFICAÇÕES
//  Adicionado sem remover a estrutura original do projeto.
// ═══════════════════════════════════════════════════

const notificacoesCarePlus = [
  {
    titulo: 'Consulta confirmada',
    texto: 'Cardiologista confirmado para 31 de maio de 2026 às 09:30.',
    icon: 'bi-calendar-check-fill',
    bg: '#e8f0fe',
    color: '#1e4fc2',
    unread: true
  },
  {
    titulo: 'Pontos acumulados',
    texto: 'Você possui 850 pontos no programa CarePlus.',
    icon: 'bi-trophy-fill',
    bg: '#fff7ed',
    color: '#f59e0b',
    unread: true
  },
  {
    titulo: 'Dica de saúde',
    texto: 'Mantenha seus exames preventivos em dia.',
    icon: 'bi-heart-pulse-fill',
    bg: '#dcfce7',
    color: '#22c55e',
    unread: false
  }
];

function addNotificacao(titulo, texto, icon = 'bi-bell-fill', bg = '#e8f0fe', color = '#1e4fc2') {
  notificacoesCarePlus.unshift({ titulo, texto, icon, bg, color, unread: true });
  renderNotificacoes();
}

function aplicarModoVisual(mode) {
  const body = document.body;
  body.classList.remove('theme-dark');

  let modoFinal = mode;
  if (mode === 'auto') {
    modoFinal = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  if (modoFinal === 'dark') {
    body.classList.add('theme-dark');
  }
}

function selectMode(el, mode = 'light') {
  const group = el.closest('.mode-btns');
  if (group) {
    group.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
  }
  el.classList.add('selected');
  aplicarModoVisual(mode);
  toast(mode === 'dark' ? 'Modo escuro atualizado!' : mode === 'auto' ? 'Modo automático atualizado!' : 'Modo claro atualizado!');
}

function selectSwatch(el) {
  const group = el.closest('.color-swatches');
  if (group) {
    group.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
  }
  el.classList.add('selected');

  const primary = el.dataset.color || el.getAttribute('data-color');
  const light = el.dataset.light || el.getAttribute('data-light');
  if (primary) document.documentElement.style.setProperty('--primary', primary);
  if (light) document.documentElement.style.setProperty('--primary-light', light);

  toast('Cor principal atualizada!');
}

function selectFont(el, size = 'medium') {
  const group = el.closest('.font-btns');
  if (group) {
    group.querySelectorAll('.font-btn').forEach(b => b.classList.remove('selected'));
  }
  el.classList.add('selected');

  const scales = { small: '0.92', medium: '1', large: '1.1' };
  document.documentElement.style.setProperty('--font-scale', scales[size] || '1');
  toast('Fonte atualizada!');
}

function renderConsultaStats() {
  const stats = document.getElementById('consultas-stats');
  if (!stats) return;

  const total = consultas.length;
  const confirmadas = consultas.filter(c => c.status === 'confirmada').length;
  const realizadas = consultas.filter(c => c.status === 'realizada').length;
  const canceladas = consultas.filter(c => c.status === 'cancelada').length;

  stats.innerHTML = `
    <div class="col-md-3">
      <div class="stat-card">
        <div class="stat-icon" style="background:var(--primary-pale); color:var(--primary)"><i class="bi bi-calendar2-week"></i></div>
        <div><div class="stat-label">Total</div><div class="stat-value">${total}</div><div class="stat-sub">consultas</div></div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="stat-card">
        <div class="stat-icon" style="background:var(--primary-pale); color:var(--primary)"><i class="bi bi-check-circle"></i></div>
        <div><div class="stat-label">Confirmadas</div><div class="stat-value">${confirmadas}</div><div class="stat-sub">em aberto</div></div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="stat-card">
        <div class="stat-icon" style="background:var(--green-pale); color:var(--green)"><i class="bi bi-clipboard2-check"></i></div>
        <div><div class="stat-label">Realizadas</div><div class="stat-value">${realizadas}</div><div class="stat-sub">histórico</div></div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="stat-card">
        <div class="stat-icon" style="background:var(--red-pale); color:var(--red)"><i class="bi bi-x-circle"></i></div>
        <div><div class="stat-label">Canceladas</div><div class="stat-value">${canceladas}</div><div class="stat-sub">atenção</div></div>
      </div>
    </div>`;
}

function renderNotificacoes() {
  const list = document.getElementById('notif-list');
  const dot = document.getElementById('notif-dot');
  if (!list) return;

  if (dot) {
    dot.classList.toggle('visible', notificacoesCarePlus.some(n => n.unread));
  }

  list.innerHTML = notificacoesCarePlus.length ? notificacoesCarePlus.map((n, index) => `
    <div class="notif-item ${n.unread ? 'unread' : ''}" onclick="marcarNotificacaoLida(${index})">
      <div class="notif-icon" style="background:${n.bg}; color:${n.color}">
        <i class="bi ${n.icon}"></i>
      </div>
      <div class="notif-text">
        <strong>${n.titulo}</strong>
        <span>${n.texto}</span>
      </div>
    </div>
  `).join('') : '<div class="notif-empty">Nenhuma notificação por enquanto.</div>';
}

function toggleNotifPanel() {
  const panel = document.getElementById('notif-panel');
  if (!panel) return;
  panel.classList.toggle('open');
  renderNotificacoes();
}

function marcarNotificacaoLida(index) {
  if (notificacoesCarePlus[index]) {
    notificacoesCarePlus[index].unread = false;
  }
  renderNotificacoes();
}

function marcarTodasLidas() {
  notificacoesCarePlus.forEach(n => n.unread = false);
  renderNotificacoes();
  toast('Notificações marcadas como lidas.');
}

function descricaoClimaPorCodigo(code) {
  const descricoes = {
    0: ['☀️', 'Céu limpo'],
    1: ['🌤️', 'Principalmente limpo'],
    2: ['⛅', 'Parcialmente nublado'],
    3: ['☁️', 'Nublado'],
    45: ['🌫️', 'Neblina'],
    48: ['🌫️', 'Neblina com geada'],
    51: ['🌦️', 'Garoa fraca'],
    53: ['🌦️', 'Garoa moderada'],
    55: ['🌧️', 'Garoa intensa'],
    61: ['🌧️', 'Chuva fraca'],
    63: ['🌧️', 'Chuva moderada'],
    65: ['🌧️', 'Chuva forte'],
    80: ['🌦️', 'Pancadas fracas'],
    81: ['🌧️', 'Pancadas moderadas'],
    82: ['⛈️', 'Pancadas fortes'],
    95: ['⛈️', 'Trovoadas']
  };
  return descricoes[code] || ['☁️', 'Clima atualizado'];
}

async function carregarClimaSP() {
  const homeClima = document.getElementById('home-clima');
  const previewClima = document.getElementById('preview-clima');
  if (!homeClima && !previewClima) return;

  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=-23.5505&longitude=-46.6333&current_weather=true&timezone=America%2FSao_Paulo';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Falha ao consultar clima');
    const data = await response.json();
    const atual = data.current_weather;
    const temp = Math.round(atual.temperature);
    const [emoji, desc] = descricaoClimaPorCodigo(atual.weathercode);

    if (homeClima) {
      homeClima.innerHTML = `
        <div style="font-size:2rem">${emoji}</div>
        <div>
          <div class="temp">${temp}°C</div>
          <div class="desc">São Paulo — ${desc}</div>
        </div>`;
    }

    if (previewClima) {
      previewClima.textContent = `${emoji} ${temp}°C — ${desc}`;
    }
  } catch (error) {
    if (homeClima) {
      homeClima.innerHTML = `
        <i class="bi bi-cloud" style="font-size:2rem"></i>
        <div>
          <div class="temp">--°C</div>
          <div class="desc">Não foi possível carregar agora</div>
        </div>`;
    }
    if (previewClima) {
      previewClima.textContent = '☁️ Não foi possível carregar agora';
    }
  }
}

const initAppOriginalCarePlus = initApp;
initApp = function() {
  initAppOriginalCarePlus();
  renderConsultaStats();
  renderNotificacoes();
  carregarClimaSP();
};

document.addEventListener('DOMContentLoaded', () => {
  renderNotificacoes();
  carregarClimaSP();

  document.addEventListener('click', (event) => {
    const panel = document.getElementById('notif-panel');
    const button = document.getElementById('notif-btn');
    if (!panel || !button) return;
    if (!panel.contains(event.target) && !button.contains(event.target)) {
      panel.classList.remove('open');
    }
  });
});
